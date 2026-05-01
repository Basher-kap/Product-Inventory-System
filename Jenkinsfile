pipeline {
    agent any

    environment {
        VERCEL_PROJECT_ID = 'prj_lANhhYgapzaZHznlYYGdmwWLOiO6'
        VERCEL_AUTH_TOKEN = credentials('vercel-token')
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    node --version
                    npm --version
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm install vercel
                    node_modules/.bin/vercel --version
                    echo "Deploying to Production. Project ID: $VERCEL_PROJECT_ID"
                    vercel deploy --prod --token=$VERCEL_AUTH_TOKEN 
                '''
            }
        }

    }

}