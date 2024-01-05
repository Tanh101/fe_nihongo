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
        // stage('Docker Build') {
        //     steps {
        //         withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
        //             sh 'docker build -t lyvantanh1001/fe_nihongo:v1.0 .'
        //             sh 'docker push lyvantanh1001/fe_nihongo:v1.0'
        //         }
        //     }
        // }
        stage('SSH server') {
            steps {
                sshagent(['ssh-remote']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l ubuntu 18.136.203.158 "sudo touch demo.txt"'
                }
            }
        }
    } 
}
