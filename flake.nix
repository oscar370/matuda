{
  description = "Entorno de desarrollo para Tauri";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        libraries = with pkgs; [
          webkitgtk_4_1
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl_3
          librsvg
          libayatana-appindicator
        ];

        packages = with pkgs; [
          curl
          wget
          pkg-config
          dbus
          openssl_3
          librsvg
          libxdo
          nodePackages.nodejs
          rustc
          cargo
          rust-analyzer
          rustfmt
          clippy
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = packages ++ libraries;

          shellHook = ''
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
            export XDG_DATA_DIRS=${pkgs.gsettings-desktop-schemas}/share/gsettings-data-schemas:$XDG_DATA_DIRS
          '';

          PKG_CONFIG_PATH = "${pkgs.lib.makeSearchPathOutput "dev" "lib/pkgconfig" libraries}";
        };
      }
    );
}
