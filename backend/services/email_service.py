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

# Store OTPs with expiration times
otps = {}
signup_otps = {}

def generate_otp(length=6):
    """Generate a random OTP."""
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

        print(f"Attempting to send email to: {email} with subject: {subject}")
        print(f"SMTP Server: {SMTP_SERVER}, Port: {SMTP_PORT}, Username: {SMTP_USERNAME}")

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.set_debuglevel(1) # Enable SMTP debug output
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Email successfully sent to {email}")
        return True # Explicitly return True on success
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {str(e)}. Check SMTP_USERNAME and SMTP_PASSWORD.")
        return False
    except smtplib.SMTPServerDisconnected as e:
        print(f"SMTP Server Disconnected: {str(e)}. Check SMTP_SERVER and SMTP_PORT.")
        return False
    except smtplib.SMTPRecipientsRefused as e:
        print(f"SMTP Recipients Refused: {str(e)}. Check recipient email address.")
        return False
    except ConnectionRefusedError as e:
        print(f"Connection Refused Error: {str(e)}. Check SMTP_SERVER, SMTP_PORT, and firewall settings.")
        return False
    except Exception as e:
        print(f"An unexpected error occurred while sending email to {email}: {str(e)}")
        import traceback
        traceback.print_exc() # Print full traceback for unexpected errors
        return False

async def send_otp_email(email: str, otp: str = None):
    """Send an OTP to the user's email for password reset."""
    if not otp:
        otp = generate_otp()
    
    # Store OTP with 10-minute expiration
    otps[email] = {
        'otp': otp,
        'expires_at': datetime.now() + timedelta(minutes=10)
    }
    
    subject = "Password Reset - Verification Code"
    body = f"""
    <html>
    <body>
    <h2>Password Reset Request</h2>
    <p>You have requested to reset your password for AarthikNiti. Here is your verification code:</p>
    <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f5f5f5; padding: 10px; text-align: center;">{otp}</h1>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    </body>
    </html>
    """
    
    return await send_email(email, subject, body)

async def verify_otp(email: str, otp: str):
    """Verify if the provided OTP for reset is valid and not expired."""
    if email not in otps:
        return False
    
    stored_otp = otps[email]
    
    if datetime.now() > stored_otp['expires_at']:
        # OTP has expired, remove it
        del otps[email]
        return False
    
    if otp == stored_otp['otp']:
        # OTP is valid, remove it so it can't be reused
        del otps[email]
        return True
    
    return False

async def send_signup_otp(email: str):
    """Send OTP for account signup verification."""
    otp = generate_otp()
    
    # Store OTP with 10-minute expiration
    signup_otps[email] = {
        'otp': otp,
        'expires_at': datetime.now() + timedelta(minutes=10)
    }
    
    subject = "Complete Your Registration - Verification Code"
    body = f"""
    <html>
    <body>
    <h2>Email Verification</h2>
    <p>Thank you for registering with AarthikNiti. Please verify your email address with this code:</p>
    <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f5f5f5; padding: 10px; text-align: center;">{otp}</h1>
    <p>This code will expire in 10 minutes.</p>
    </body>
    </html>
    """
    
    return await send_email(email, subject, body)

async def verify_signup_otp(email: str, otp: str):
    """Verify if the provided signup OTP is valid and not expired."""
    if email not in signup_otps:
        return False
    
    stored_otp = signup_otps[email]
    
    if datetime.now() > stored_otp['expires_at']:
        # OTP has expired, remove it
        del signup_otps[email]
        return False
    
    if otp == stored_otp['otp']:
        # OTP is valid, remove it so it can't be reused
        del signup_otps[email]
        return True
    
    return False

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

async def send_two_factor_code(email, code):
    """Send a two-factor authentication code to the user's email."""
    subject = "Two-Step Verification Code"
    body = f"""
    <html>
    <body>
    <h2>Two-Step Verification</h2>
    <p>You're logging in to AarthikNiti. Here is your verification code:</p>
    <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f5f5f5; padding: 10px; text-align: center;">{code}</h1>
    <p>This code will expire in 15 minutes.</p>
    <p>If you did not request this, please secure your account immediately.</p>
    </body>
    </html>
    """
    
    return await send_email(email, subject, body)