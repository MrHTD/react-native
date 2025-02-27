pipeline {
    agent any
    environment {
        APP_NAME = 'react-native'
        REPO_NAME = 'react-native'
        DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1328627802194444359/wKmS_3V7cbHvBZzQu8B2JB1A1Hqc9Q0-vj0mIQLqD5ZH_bQCXg5aj0LLdBEqQq4dGem5'
        APK_PATH = "/home/ahmed/development/${REPO_NAME}/android/app/build/outputs/apk/release/app-release.apk"
        APK_NAME = 'app-release.apk'
    }
    stages {
        stage('Git Pull or Clone') {
            steps {
                sshagent(['ssh']) {
                    echo 'Pulling latest code from Git repository...'
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
                        set -x

                        # Check if the development directory exists
                        if [ ! -d "/home/ahmed/development" ]; then
                            echo "Directory /home/ahmed/development does not exist. Creating it..."
                            mkdir -p "/home/ahmed/development"
                        fi

                        # Navigate to the directory (outside the if block so it always runs)
                        cd /home/ahmed/development || { echo "Failed to change directory"; exit 1; }

                        # List files to ensure we're in the right directory
                        echo 'Listing contents of development directory...';
                        ls -la;

                        # Check if the repository folder exists inside development
                        if [ ! -d '${REPO_NAME}' ]; then
                            echo 'Repository folder does not exist. Cloning repository...';
                            git clone ${env.GIT_URL} ${REPO_NAME};
                            cd ${REPO_NAME};
                            git switch ${env.BRANCH_NAME};
                        else
                            echo 'Repository folder exists. Checking if it is a Git repository...';
                            cd ${REPO_NAME};

                            # Check if it's a Git repository
                            if [ ! -d '.git' ]; then
                                echo 'Not a Git repository. Initializing repository...';
                                git init;
                                git remote add origin ${env.GIT_URL};
                                git fetch origin;
                                git switch ${env.BRANCH_NAME};
                            else
                                echo 'Directory is a Git repository. Pulling latest changes...';
                                git fetch origin;
                                git switch ${env.BRANCH_NAME};
                                git pull origin ${env.BRANCH_NAME};
                            fi
                        fi
                    """
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sshagent(['ssh']) {
                    echo 'Installing Node.js dependencies...'
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
                        set -x
                        cd /home/ahmed/development/${REPO_NAME}
                        yarn install
                    """
                }
            }
        }
        // stage("Build App") {
        //     steps {
        //         sshagent(['ssh']) {
        //             sh """
        //                 ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
        //                 cd /home/ahmed/development/${APP_NAME}/android
        //                 ./gradlew clean

        //                 ./gradlew build
        //             """
        //         }
        //     }
        // }
        // stage("Build APK") {
        //     steps {
        //         sshagent(['ssh']) {
        //             echo "Building APK..."
        //             sh """
        //                 ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
        //                 cd /home/ahmed/development/${APP_NAME}/android
        //                 ./gradlew assembleRelease
        //             """
        //         }
        //     }
        // }
        stage("Copying APK") {
        steps {
                sshagent(['ssh']) {
                    echo "Building APK..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
                        cd '/home/ahmed/development/${REPO_NAME}/android/app/build/outputs/apk/release/';
                        sudo cp ./app-release.apk /home/ahmed/apk/\$(date +"%Y-%m-%d")-$(basename ${APK_PATH};
                        ls -l;
                    """
                }
            }
        }
        stage('Download APK') {
            steps {
                script {
                    def message = "APK Uploaded Successfully! 🎉\n\n📥 **Download APK:** [Click Here](http://${env.SSH_HOST}/apk/)"

                    discordSend(
                        description: message,
                        footer: 'Jenkins Pipeline Notification',
                        result: 'SUCCESS',
                        title: "${REPO_NAME} APK Ready!",
                        webhookURL: env.DISCORD_WEBHOOK
                    )

                    echo "Message sent to Discord: ${message}"
                }
            }
        }
        // stage("Upload APK to Discord") {
        //     steps {
        //         sshagent(['ssh']) {
        //             sh """
        //                 ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH

        //                 if [ -f "${APK_PATH}" ]; then
        //                     curl -F "file=@${APK_PATH}" ${DISCORD_WEBHOOK}
        //                 else
        //                     echo "APK file not found!"
        //                     exit 1
        //                 fi
        //             """
        //         }
        //     }
        // }
    }
    post {
        success {
            discordSend description: "✅ React Native Build succeeded for ${APP_NAME}!", footer: 'Jenkins Pipeline Notification', link: env.BUILD_URL, result: 'SUCCESS', title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
        failure {
            discordSend description: "❌ React Native Build failed for ${APP_NAME}. Check logs!", footer: 'Jenkins Pipeline Notification', link: env.BUILD_URL, result: 'FAILURE', title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
        always {
            echo 'Pipeline completed.'
        }
    }
}
