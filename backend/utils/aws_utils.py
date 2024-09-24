import os
import boto3
import base64
from botocore.exceptions import ClientError
from dotenv import load_dotenv
load_dotenv()


# Create a session using the credentials and region
session = boto3.Session(
    region_name= 'ap-south-1'
)


def get_secret(secret_name):
    client = session.client(
        service_name='secretsmanager',
        region_name='ap-south-1'  # e.g., 'us-east-1'
    )

    try:
        # Fetch the secret value
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name)

        # Decrypts secret using the associated KMS key.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            secret = base64.b64decode(
                get_secret_value_response['SecretBinary'])

        return secret

    except ClientError as e:
        raise e


def get_parameter(parameter_name):
    client = session.client('ssm')

    try:
        # Fetch the parameter value
        parameter = client.get_parameter(
            Name=parameter_name, WithDecryption=True)
        return parameter['Parameter']['Value']

    except ClientError as e:
        raise e