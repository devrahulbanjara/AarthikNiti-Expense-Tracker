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

async def store_otp(email: str, otp: str, purpose: str = "reset"):
    """Store OTP in database with expiration time and purpose."""
    expiration_time = datetime.utcnow() + timedelta(minutes=10)
    await otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "purpose": purpose,
        "expires_at": expiration_time,
        "created_at": datetime.utcnow()
    })

async def send_email(email: str, subject: str, html_body: str):
    """Send an email with the specified subject and HTML body."""
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Error sending email: {str(e)}")

async def send_otp_email(email: str):
    """Send OTP to user's email for password reset."""
    try:
        otp = generate_otp()
        print(f"Generated OTP: {otp}")
        await store_otp(email, otp, "reset")

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
        await send_email(email, "Password Reset OTP - AarthikNiti", body)
        return True
    except Exception as e:
        print(f"Error sending reset OTP: {str(e)}")
        return False

async def verify_otp(email: str, otp: str):
    """Verify if the provided OTP for reset is valid and not expired."""
    stored_otp = await otp_collection.find_one({
        "email": email,
        "otp": otp,
        "purpose": "reset",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    return stored_otp is not None

async def send_signup_otp(email: str):
    """Send OTP for account signup verification."""
    try:
        otp = generate_otp()
        print(f"Generated Signup OTP: {otp}")
        await store_otp(email, otp, "signup")

        html_body = f"""
        <html>
            <body>
                <h2>Account Verification</h2>
                <p>Your OTP to verify your signup is: <strong>{otp}</strong></p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't try to register, please ignore this email.</p>
                <br>
                <p>Best regards,<br>AarthikNiti Team</p>
            </body>
        </html>
        """
        await send_email(email, "Signup Verification OTP - AarthikNiti", html_body)
        return True
    except Exception as e:
        print(f"Error sending signup OTP: {str(e)}")
        return False

async def verify_signup_otp(email: str, otp: str):
    """Verify if the provided signup OTP is valid and not expired."""
    stored_otp = await otp_collection.find_one({
        "email": email,
        "otp": otp,
        "purpose": "signup",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    return stored_otp is not None