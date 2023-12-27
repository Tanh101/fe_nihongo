pipeline {
    agent any
    environment {
        GIT_BRANCH = 'feature/ci-cd'
    }
    stages {
        stage('Clone') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: "*/${GIT_BRANCH}"]], userRemoteConfigs: [[url: 'https://github.com/Tanh101/fe_nihongo.git']]])
                }
            }
        }
        stage('Docker') {
            steps {
                withDockerRegistry(url: 'https://index.docker.io/v1/') {
                    sh 'docker build -t fe_nihongo:v1.0 .'
                    sh 'docker push fe_nihongo:v1.0 .'
                }
            }
        }
    }
}
