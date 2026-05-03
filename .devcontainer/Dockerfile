FROM mcr.microsoft.com/devcontainers/base:trixie

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libsoup-3.0-dev \
  libwebkit2gtk-4.1-dev \
  libjavascriptcoregtk-4.1-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV DEBIAN_FRONTEND=dialog
ENV GTK_THEME=Adwaita:dark