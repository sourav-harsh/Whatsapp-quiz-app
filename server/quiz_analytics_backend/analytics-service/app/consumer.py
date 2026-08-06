import os
import json
import asyncio
import aio_pika
from datetime import datetime
from app.database import db

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost/")
EXCHANGE_NAME = "quiz_events"
QUEUE_NAME = "analytics_attempts_queue"


async def consume_events():
    # Retry loop to wait for RabbitMQ startup
    while True:
        try:
            connection = await aio_pika.connect_robust(RABBITMQ_URL)
            break
        except Exception:
            await asyncio.sleep(3)

    channel = await connection.channel()
    exchange = await channel.declare_exchange(
        EXCHANGE_NAME, aio_pika.ExchangeType.TOPIC, durable=True
    )
    queue = await channel.declare_queue(QUEUE_NAME, durable=True)
    await queue.bind(exchange, routing_key="quiz.question.attempted")

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                payload = json.loads(message.body.decode("utf-8"))
                # Parse ISO strings back to datetime objects for accurate mongo querying
                payload["question_shown_time"] = datetime.fromisoformat(
                    payload["question_shown_time"]
                )
                payload["answer_submitted_time"] = datetime.fromisoformat(
                    payload["answer_submitted_time"]
                )
                await db.question_attempts.insert_one(payload)
