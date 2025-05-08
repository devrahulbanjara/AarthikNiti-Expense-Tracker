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

async def send_signup_success_email(email: str, full_name: str):
    """Send a welcome email after successful signup."""
    try:
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0a6e47; margin-bottom: 5px;">Welcome to AarthikNiti!</h1>
                    <p style="font-size: 18px; color: #666;">Your Financial Journey Begins Now</p>
                </div>
                
                <div style="background-color: #f9f9f9; border-left: 4px solid #0a6e47; padding: 15px; margin-bottom: 25px;">
                    <p>Dear <strong>{full_name}</strong>,</p>
                    <p>Thank you for joining AarthikNiti! Your account has been successfully created and is ready to use.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://aarthik-niti-expense-tracker.vercel.app/login" style="background-color: #0a6e47; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 16px;">Login to Your Account</a>
                    <p style="margin-top: 10px; font-size: 14px; color: #666;">Click the button above to login with your new credentials</p>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h2 style="color: #0a6e47; font-size: 18px;">Get Started with These Simple Steps:</h2>
                    <ol style="padding-left: 20px;">
                        <li>Set up your financial profiles</li>
                        <li>Track your expenses and income</li>
                        <li>Set budgets and financial goals</li>
                        <li>Analyze your spending patterns with our insights</li>
                    </ol>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h2 style="color: #0a6e47; font-size: 18px;">Need Help?</h2>
                    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at <a href="mailto:support@aarthikniti.com" style="color: #0a6e47; text-decoration: none; font-weight: bold;">support@aarthikniti.com</a>.</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                    <p style="margin-top: 0;"><strong>Login URL:</strong> <a href="https://aarthik-niti-expense-tracker.vercel.app/login" style="color: #0a6e47; word-break: break-all;">https://aarthik-niti-expense-tracker.vercel.app/login</a></p>
                    <p style="margin-bottom: 0;"><strong>Email:</strong> {email}</p>
                </div>
                
                <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; font-size: 14px; color: #777;">
                    <p>Thank you for choosing AarthikNiti for your financial management needs.</p>
                    <p>Best regards,<br><strong>The AarthikNiti Team</strong></p>
                </div>
            </body>
        </html>
        """
        await send_email(email, "Welcome to AarthikNiti - Account Successfully Created", html_body)
        return True
    except Exception as e:
        print(f"Error sending signup success email: {str(e)}")
        return False