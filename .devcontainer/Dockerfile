FROM mcr.microsoft.com/devcontainers/base:trixie

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  curl \
  file \
  gir1.2-javascriptcoregtk-4.1 \
  gir1.2-webkit2-4.1 \
  libayatana-appindicator3-dev \
  libjavascriptcoregtk-4.1-0 \
  libjavascriptcoregtk-4.1-dev \
  librsvg2-dev \
  libssl-dev \
  libwebkit2gtk-4.1-0 \
  libwebkit2gtk-4.1-dev \
  libxdo-dev \
  patchelf \
  wget \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV DEBIAN_FRONTEND=dialog
ENV GTK_THEME=Adwaita:dark