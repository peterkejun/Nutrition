from hashlib import sha256
import re, json, math, random
from flask_mail import Mail, Message


hash_function = sha256()


mail = Mail()
with open('gmail_credentials.json', 'r') as cred:
    g_cred = json.load(cred)
mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": g_cred['username'],
    "MAIL_PASSWORD": g_cred['password']
}


def send_verification_email(recipients):
    """Sends an email to recipients and returns the authentication code"""
    msg = Message('Test Message',
                  sender=mail_settings['MAIL_USERNAME'],
                  recipients=recipients)
    OTP = generate_OTP()
    with open('VerificationEmail.html', 'r') as html_file:
        email_html = html_file.read()
    msg.html = email_html % OTP
    mail.send(message=msg)
    return OTP


def generate_OTP(length=6, elements='0123456789'):
    """Returns a random 6-digit string of random numbers"""
    OTP = ''
    elements_count = len(elements)
    for i in range(length):
        OTP += elements[math.floor(random.random() * elements_count)]
    return OTP



def validate_email_password(email, password):
    """Return True if and only if both email and password meet requirements
    Requirements for password:
    1. Should have at least one number.
    2. Should have at least one uppercase and one lowercase character.
    3. Should have at least one special symbol.
    4. Should be between 6 to 20 characters long.
    """
    if email is None or password is None:
        return False
    password_validity = email_validity = False
    # check password
    reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"
    password_validity = re.search(re.compile(reg), password)
    # check email
    email_validity = True
    if email_validity and password_validity:
        return True, 'both valid'
    return False, ('email invalid' if password_validity else 'password invalid')


def hash_password(password):
    """Returns a hashed string of password using SHA256 hash function"""
    h = sha256()
    h.update(password.encode('UTF-8'))
    return h.hexdigest()


