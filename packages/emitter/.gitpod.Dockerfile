FROM gitpod/workspace-full

USER gitpod
RUN bash -c ". .nvm/nvm.sh \
        && nvm install 14 \
        && nvm alias default 14 \
        && npm install pnpm -g"

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
# RUN sudo apt-get -q update && #     sudo apt-get install -yq bastet && #     sudo rm -rf /var/lib/apt/lists/*
#
# More information: https://www.gitpod.io/docs/config-docker/
