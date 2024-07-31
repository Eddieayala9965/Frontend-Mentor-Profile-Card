import boto3 
from fastapi import UploadFile
from botocore.exceptions import NoCredentialsError
import uuid
import os 
from dotenv import load_dotenv

load_dotenv()


AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")   

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

def upload_file_to_s3(file: UploadFile):
    try:
        file_extension = file.filename.split(".")[-1]
        file_key = f"{uuid.uuid4()}.{file_extension}"
        s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, file_key)
        file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_key}"
        return file_url
    except NoCredentialsError:
        return {"error": "Credentials not available"}
    except Exception as e:
        return {"error": str(e)}

def create_presigned_url(bucket_name, object_name, expiration=3600):
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                        Params={'Bucket': bucket_name, 'Key': object_name},
                                                        ExpiresIn=expiration)
    except Exception as e:
        print(e)
        return None
    return response