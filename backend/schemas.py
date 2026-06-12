
User_Collection = {
    "user_id": "Unique Object ID",
    "username": "String (User-oda peru)",
    "email": "String (User-oda Email ID)",
    "password": "Hashed String (Encrypted Password)"
}


Interview_Collection = {
    "interview_id": "Unique Object ID",
    "user_id": "String (User collection-oda link panna)",
    "job_role": "String (Eg: React Developer)",
    "experience_level": "String (Eg: Fresher / Experienced)",
    "date_created": "DateTime"
}


Feedback_Collection = {
    "feedback_id": "Unique Object ID",
    "interview_id": "String (),
    "question_text": "String ()",
    "user_answer_text": "String ()",
    "score": "Integer ()",
    "ai_suggestions": "String ()"
}