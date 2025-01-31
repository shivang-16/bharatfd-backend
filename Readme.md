# FAQ Backend API

A multilingual FAQ management system with automatic translation support, built with Node.js, Express, MongoDB, and Redis.

## Features

- Create and manage FAQs with rich text support
- Automatic translation to multiple languages
- Redis caching for improved performance
- RESTful API endpoints
- Rich text editor interface
- Docker support for easy deployment

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Cache:** Redis
- **Frontend:** HTML, JavaScript (Quill.js for rich text editing)
- **Translation:** Google Translate API
- **Testing:** Mocha, Chai
- **Containerization:** Docker

## Prerequisites

Before starting, ensure that you have the following installed:

- Node.js (v18 or higher)
- MongoDB
- Redis
- Docker (optional)

## Installation

### Local Development

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd bharatfd
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create an `.env` file and add the following environment variables:

    ```
    MONGO_URI=mongodb://localhost:27017/faqdb
    REDIS_URL=redis://localhost:6379
    PORT=4000
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

### Docker Deployment

You can also deploy the application using Docker by running the following command:

```bash
docker compose up --build
```

- Docker Hub Repo: [bharatfd-backend](https://hub.docker.com/r/shivangm16/bharatfd-backend)

## API Endpoints

### Create FAQ
- **POST** `/api/faqs`
- **Body:** 
    ```json
    {
      "question": "What is FAQ?",
      "answer": "FAQ stands for Frequently Asked Questions."
    }
    ```
- **Response:** `201 Created`

### Get FAQs
- **GET** `/api/faqs`
- **Query Parameters:**
    - `lang`: Language code (e.g., `'hi'` for Hindi, `'es'` for Spanish)
- **Response:** `200 OK`

## Supported Languages
- Hindi (`hi`)
- Bengali (`bn`)
- Spanish (`es`)
- French (`fr`)
- German (`de`)
- Chinese (`zh`)
- Arabic (`ar`)
- Russian (`ru`)
- Japanese (`ja`)
- Portuguese (`pt`)

## Testing

Run the test suite with:

```bash
npm test
```

## Web Interface

Access the FAQ editor interface at:

```plaintext
http://localhost:8000/
```

## Deployment

The application has been deployed on an AWS EC2 instance using GitHub Actions. You can access the live version at:

```plaintext
http://15.206.191.142:8000/
```

Please note that the IP address above is the **public IPv4 address** of the EC2 instance, which is required to access the application externally.
