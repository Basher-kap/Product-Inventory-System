// a-ITE193/Jenkinsfile

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        PROJECT_DIR = 'C:\\Users\\User\\source\\repos\\A-ITE193'
    }

    stages {
        stage('Install') {
            steps {
                bat 'cd %PROJECT_DIR% && npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'cd %PROJECT_DIR% && npm test'
            }
        }
    }

    post {
        success { echo 'All tests passed!' }
        failure { echo 'Build failed!' }
    }
}