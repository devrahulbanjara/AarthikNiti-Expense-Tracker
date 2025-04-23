import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import random
import string
from datetime import datetime, timedelta
from database import otp_collection

load_dotenv()

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

def generate_otp(length=6):
    """Generate a random OTP of specified length."""
    return ''.join(random.choices(string.digits, k=length))

async def store_otp(email: str, otp: str):
    """Store OTP in database with expiration time."""
    expiration_time = datetime.utcnow() + timedelta(minutes=10)
    await otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": expiration_time,
        "created_at": datetime.utcnow()
    })

async def send_otp_email(email: str):
    """Send OTP to user's email."""
    try:
        # Generate OTP
        otp = generate_otp()
        
        # Store OTP in database
        await store_otp(email, otp)
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = email
        msg['Subject'] = "Password Reset OTP - AarthikNiti"
        
        # Email body
        body = f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>Your OTP for password reset is: <strong>{otp}</strong></p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Best regards,<br>AarthikNiti Team</p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Connect to SMTP server and send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

async def verify_otp(email: str, otp: str):
    """Verify if the provided OTP is valid and not expired."""
    stored_otp = await otp_collection.find_one({
        "email": email,
        "otp": otp,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    return stored_otp is not None 