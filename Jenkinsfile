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
    }
}
