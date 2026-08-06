# Whatsapp-quiz-app

## Architecture
The application is built using microservices architecture. The main reason for this is to make the application scalable and maintainable and more specifically to make the analytics service seperate out as it is not directly related to the core application which is to take the quiz, So the main services in the arhitecture are user-service, exam-service, client or we an scale it up if user count increases, we don't need to scale the analytics service much as compared to the core application. To achieve asynchronous communication between the services, I use message queues(RabbitMQ). Analytics service is responsible for processing the messages and storing the data in the database.

## Database Design
So the database design is as follows:
* User DB- This DB will store the user details.
* Exam DB- This DB will store the exam details.
* Analytics DB- This DB will store the analytics details.

### Exam DB
In this DB there are 4 collections:
* exams
* subjects
* chapters
* questions
* question_attempts

So basically exams has subjects, subjects has chapters, chapters has questions and questions will be attempted by the user. And question_attempts will store the attempts of the user for the questions with some metadata.

### Client
So the client will be a simple web application which will be used to take the quiz. Tech stack used is React.js, tailwindcss.

### Server
So the server will be a simple API gateway which will be used to route the requests to the appropriate service using the Nginx configuration with the help of docker-compose network. **Why use Nginx?** Because it is a simple and efficient way to route the requests to the appropriate service and it is single gateway to access the services.

#### We have 3 services:
1. User Service- This service will handle all the user related operations.
2. Exam Service- This service will handle all the exam related operations.
3. Analytics Service- This service will handle all the analytics related operations.

## Pre-requsite
1. Docker

## Setups To Run
1. First run the ```docker-compose up --build -d``` in the root directory
2. Then run the seed_microservices.py script using ``` python3 seed_microservices.py``` inside the **server/quiz_analytics_backend directory**, where this script is present, this script will seed the database with the initial data.
3. Frontend will launch on - ```http://localhost:5174``` 

## Endpoints

```http request
// Exams 
POST   /api/v1/exams
GET    /api/v1/exams
GET    /api/v1/exams/{exam_id}

// Subject
POST   /api/v1/subjects
GET    /api/v1/exams/{exam_id}/subjects
GET    /api/v1/subjects/{subject_id}

// Chapter
POST   /api/v1/chapters
GET    /api/v1/subjects/{subject_id}/chapters
GET    /api/v1/chapters/{chapter_id}

// Question
GET    /api/v1/chapters/{chapter_id}/questions
GET    /api/v1/subjects/{subject_id}/questions
GET    /api/v1/exams/{exam_id}/questions
GET    /api/v1/questions/{question_id}

// Analytics
GET    /api/v1/analytics/learning-velocity
GET    /api/v1/analytics/fatigue-analysis?user_id={user_id}
GET    /api/v1/analytics/question-difficulty
```

## Future Scope
We can use the three DB architecture for a single service to make the application more scalable and which reduce the DB bottleneck.As two DB will be used for read purpose and one master DB which will handle the write operations. But for this we need to bear the data inconsistency between the DBs for a short period of time.
