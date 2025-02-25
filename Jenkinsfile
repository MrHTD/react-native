pipeline {
    agent any
    environment {
        APP_NAME = "react-native"
        REPO_NAME = "react-native"
        REPO_URL = "git@github.com:ahmed/mawrid-vendor.git"
        DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1328627802194444359/wKmS_3V7cbHvBZzQu8B2JB1A1Hqc9Q0-vj0mIQLqD5ZH_bQCXg5aj0LLdBEqQq4dGem5"
        ANDROID_BUILD_PATH = "/home/ahmed/development/${REPO_NAME}/android/app/build/outputs/apk/release/app-release.apk"
    }
    stages {
        stage("Git Pull or Clone") {
            steps {
                sshagent(['ssh']) {
                    echo "Pulling latest code from Git repository..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
                        set -x
                        mkdir -p /home/ahmed/development
                        cd /home/ahmed/development

                        if [ ! -d '${REPO_NAME}' ]; then
                            git clone ${REPO_URL} ${REPO_NAME}
                            cd ${REPO_NAME}
                            git switch ${env.BRANCH_NAME}
                        else
                            cd ${REPO_NAME}
                            git switch ${env.BRANCH_NAME}
                            git pull origin ${env.BRANCH_NAME}
                        fi
                    """
                }
            }
        }
        stage("Install Dependencies") {
            steps {
                sshagent(['ssh']) {
                    echo "Installing Node.js dependencies..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
                        set -x
                        cd /home/ahmed/development/${REPO_NAME}
                        yarn install --frozen-lockfile
                    """
                }
            }
        }
        stage("Start Metro Bundler") {
            steps {
                sshagent(['ssh']) {
                    echo "Starting Metro Bundler..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} "cd /home/ahmed/development/${REPO_NAME} && nohup yarn start > metro.log 2>&1 &"
                    """
                }
            }
        }
        stage("Build and Run Android App") {
            steps {
                sshagent(['ssh']) {
                    echo "Building and Running Android App..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} << ENDSSH
                        set -x
                        cd /home/ahmed/development/${REPO_NAME}
                        yarn android
                    """
                }
            }
        }
        stage("Send APK to Discord") {
            steps {
                sshagent(['ssh']) {
                    echo "Uploading APK to Discord..."
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.SSH_USER}@${env.SSH_HOST} "curl -F \\"payload_json={\\\\\\"content\\\\\\": \\\\\\"📱 New APK Build for ${APP_NAME}! \\\\\\"}\\" -F \\"file=@${ANDROID_BUILD_PATH}\\" ${DISCORD_WEBHOOK}"
                    """
                }
            }
        }
    }
    post {
        success {
            discordSend description: "✅ React Native Build succeeded for ${APP_NAME}!", footer: "Jenkins Pipeline Notification", link: env.BUILD_URL, result: "SUCCESS", title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
        failure {
            discordSend description: "❌ React Native Build failed for ${APP_NAME}. Check logs!", footer: "Jenkins Pipeline Notification", link: env.BUILD_URL, result: "FAILURE", title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
        always {
            echo "Pipeline completed."
        }
    }
}
