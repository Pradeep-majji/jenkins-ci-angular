pipeline {
    agent any

    environment {
        TOMCAT_URL = 'http://localhost:8085'
        TOMCAT_USERNAME = 'admin'
        TOMCAT_PASSWORD = 'root'
        GITHUB_REPO = 'https://github.com/Pradeep-majji/jenkins-ci-angular.git'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
                bat 'npm run build -- --configuration=production'
            }
        }

        stage('Create WAR') {
            steps {
                bat '''
                    cd dist/tgg-app
                    jar -cvf ../../tgg-app.war *
                '''
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                bat '''
                    curl -T tgg-app.war "http://%TOMCAT_USERNAME%:%TOMCAT_PASSWORD%@localhost:8085/manager/text/deploy?path=/tgg-app&update=true"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
