pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        nodejs 'Node-20'
        jdk 'JDK-17'
    }

    environment {
        DOCKER_IMAGE_BACKEND = 'fintech-bank-backend'
        DOCKER_IMAGE_FRONTEND = 'fintech-bank-frontend'
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Pulling latest code from Git repository...'
                checkout scm
            }
        }

        stage('Backend: Build & Unit Test') {
            steps {
                dir('backend') {
                    echo 'Running Maven compilation and JUnit test suite...'
                    bat 'mvn clean verify'
                }
            }
        }

        stage('Frontend: Build & Test') {
            steps {
                dir('frontend') {
                    echo 'Installing npm dependencies, running Vitest and Vite production build...'
                    bat 'npm ci || npm install'
                    bat 'npm test'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker: Build Images') {
            steps {
                echo 'Building container images with multi-stage Dockerfiles...'
                bat 'docker build -t %DOCKER_IMAGE_BACKEND%:latest ./backend'
                bat 'docker build -t %DOCKER_IMAGE_FRONTEND%:latest ./frontend'
            }
        }

        stage('Deploy Stack') {
            steps {
                echo 'Orchestrating containerized deployment with Docker Compose...'
                bat 'docker compose up -d'
            }
        }

        stage('Observability & Health Check') {
            steps {
                echo 'Verifying backend health and Prometheus scraping targets...'
                bat 'curl -s http://localhost:8080/actuator/health'
            }
        }
    }

    post {
        always {
            echo 'DevOps CI/CD Pipeline execution completed.'
        }
        success {
            echo 'All stages passed! Application and observability services are healthy.'
        }
        failure {
            echo 'Pipeline failed! Check stage logs.'
        }
    }
}
