{
  description = "Tauri";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      rust-overlay,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [
            "rust-src"
            "rust-analyzer"
          ];
        };

        rustPlatform = pkgs.makeRustPlatform {
          cargo = rustToolchain;
          rustc = rustToolchain;
        };

        tauri-app = rustPlatform.buildRustPackage rec {
          pname = "Matuda";
          version = "2.0.0";
          src = ./.;
          cargoHash = "sha256-7A1gFRhcbaNtWB6WOBBbTZ6oZ8WB9ec1P4yQATOPY/g=";

          pnpmDeps = pkgs.fetchPnpmDeps {
            pname = "${pname}-pnpm-deps";
            fetcherVersion = 3;
            inherit version;
            src = ./frontend;
            hash = "sha256-HzyrWmJrN6x6YWvLqeH6etKU3PocJZiyho+26gSWySs=";
          };

          nativeBuildInputs =
            with pkgs;
            [
              cargo-tauri.hook
              nodejs
              pnpm
              pnpmConfigHook
              pkg-config
            ]
            ++ lib.optionals stdenv.hostPlatform.isLinux [ wrapGAppsHook4 ];

          buildInputs =
            with pkgs;
            lib.optionals stdenv.hostPlatform.isLinux [
              glib-networking
              openssl
              webkitgtk_4_1
            ];

          buildAndTestSubdir = "frontend/src-tauri";
          pnpmRoot = "frontend";
        };

      in
      {
        packages.default = tauri-app;

        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            pkg-config
            wrapGAppsHook4
            rustToolchain
            cargo-tauri
            nodejs
            pnpm
          ];

          buildInputs = with pkgs; [
            librsvg
            webkitgtk_4_1
          ];

          shellHook = ''
            export XDG_DATA_DIRS="$GSETTINGS_SCHEMAS_PATH"
          '';
        };
      }
    );
}
