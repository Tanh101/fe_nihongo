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
        
        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies using npm
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                // Run npm run build
                sh 'npm run build'
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
        // stage('SSH server') {
        //     steps {
        //         sshagent(['ssh-remote']) {
        //             sh 'ssh -o StrictHostKeyChecking=no -l ubuntu 18.136.203.158 uname -a'
        //         }
        //     }
        // }
        stage('CI Checks') {
            steps {
                script {
                    // Check for newline at the end of files using find and grep
                    def filesWithoutNewline = sh(script: 'find . -type f -not -exec grep -q ".$" {} \\; -print', returnStatus: true).trim()

                    if (filesWithoutNewline) {
                        error "Some files don't end with a newline character: ${filesWithoutNewline}"
                    }
                }
            }
        }
    } 
}
