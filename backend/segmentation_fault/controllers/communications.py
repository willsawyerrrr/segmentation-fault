from os import getenv

import requests
from controllers.users import get_user
from schemas.posts import Post
from schemas.users import User
from twilio.rest import Client

TWILIO_CLIENT = Client(
    username=getenv("TWILIO_ACCOUNT_SID"), password=getenv("TWILIO_AUTH_TOKEN")
)


def send_email(recipient: str, subject: str, body: str):
    return requests.post(
        f"{getenv('MAILGUN_API_BASE_URL')}{getenv('MAILGUN_DOMAIN_NAME')}/messages",
        auth=("api", getenv("MAILGUN_API_KEY")),
        data={
            "from": f"Segmentation Fault <mailgun@{getenv('MAILGUN_DOMAIN_NAME')}>",
            "to": [recipient],
            "subject": subject,
            "text": body,
        },
    )


def send_text_message(recipient: str, body: str):
    return TWILIO_CLIENT.messages.create(
        to=recipient,
        body=body,
        messaging_service_sid=getenv("TWILIO_MESSAGING_SERVICE_SID"),
    )


def send_welcome_email(user: User, token: str):
    return send_email(
        user.email,
        "Welcome to Segmentation Fault!",
        f"Hello {user.first_name},\n\nClick the link below to verify your email for Segmentation Fault:\n\n{getenv('FRONTEND_URL')}/verify-email?token={token}",
    )


def send_password_reset_email(user: User, token: str):
    return send_email(
        user.email,
        "Password Reset Requested",
        f"Hello {user.first_name},\n\nClick the link below to reset your password for Segmentation Fault:\n\n{getenv('FRONTEND_URL')}/reset-password?token={token}",
    )


async def send_comment_notification(post: Post, comment_author_id: int):
    post_author = await get_user(post.author)
    comment_author = await get_user(comment_author_id)

    return send_email(
        post_author.email,
        "Segmentation Fault: New comment on your post",
        f"Hello {post_author.first_name},\n\n{comment_author.first_name} {comment_author.last_name} commented on your post:\n{post.title}\n\n{getenv('FRONTEND_URL')}/posts/{post.id}",
    )
