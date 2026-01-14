import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import List

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL", "shwetasaw24@gmail.com")
        self.sender_password = os.getenv("SENDER_PASSWORD", "nbcp gebh gpay wobs")

    def send_alert_email(self, recipients: List[str], subject: str, message: str, alert_level: str = "Normal"):
        """
        Send alert email to admin and user recipients
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = ", ".join(recipients)
            msg['Subject'] = f"[{alert_level}] {subject}"

            # Add body
            body = f"""
            Electricity Load Management System Alert

            Alert Level: {alert_level}
            Message: {message}

            This is an automated notification from the Energy Management System.
            Please take appropriate action if necessary.

            Best regards,
            Energy Management System
            """
            msg.attach(MIMEText(body, 'plain'))

            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            text = msg.as_string()
            server.sendmail(self.sender_email, recipients, text)
            server.quit()

            return {"status": "success", "message": "Email sent successfully"}

        except Exception as e:
            return {"status": "error", "message": str(e)}

    def send_admin_notification(self, subject: str, message: str, alert_level: str = "Normal"):
        """
        Send notification to admin users
        """
        admin_emails = os.getenv("ADMIN_EMAILS", "admin@example.com").split(",")
        return self.send_alert_email(admin_emails, subject, message, alert_level)

    def send_user_notification(self, user_email: str, subject: str, message: str, alert_level: str = "Normal"):
        """
        Send notification to specific user
        """
        return self.send_alert_email([user_email], subject, message, alert_level)

# Global email service instance
email_service = EmailService()
