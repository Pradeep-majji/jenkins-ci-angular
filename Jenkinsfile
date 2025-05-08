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
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                sh '''
                    # Create WAR file
                    jar -cvf app.war -C dist .

                    # Deploy to Tomcat using curl
                    curl -T app.war "http://${TOMCAT_USERNAME}:${TOMCAT_PASSWORD}@localhost:8085/manager/text/deploy?path=/app&update=true"
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
