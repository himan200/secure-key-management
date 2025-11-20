pipeline {
    agent any 
    
    tools {
        nodejs 'NodeJS18'
    }
    
    stages {
        stage('Cloning repo') {
            steps {
                git branch: 'main', url: 'https://github.com/himan200/secure-key-management.git'
            }
        }

        stage('Checking Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Installing Frontend Dependencies') {
            steps {
                dir('Frontend') {   // make sure this matches the actual folder name
                    sh 'ls'
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }
        stage('Build App'){
            steps {
                sh 'npm run build'
            }
        }
    }
}
