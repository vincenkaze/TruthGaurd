import os
import logging
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_reset_email(email: str, token: str):
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"<p>Click <a href='{reset_link}'>here</a> to reset your password.</p>",
        subtype="html"
    )

    fm = FastMail(conf)

    try:
        logger.info(f" Preparing to send reset email to {email}")
        await fm.send_message(message)
        logger.info(f" Password reset email sent successfully to {email}")
    except Exception as e:
        logger.error(f" Failed to send reset email: {type(e).__name__} - {e}", exc_info=True)
        raise
