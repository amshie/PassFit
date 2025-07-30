#!/bin/bash

# Development Client Setup Script for PassFit
# This script helps set up and manage the development client workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check EAS CLI
check_eas_cli() {
    if ! command_exists eas; then
        print_error "EAS CLI not found. Please install it first:"
        echo "npm install -g @expo/eas-cli"
        exit 1
    fi
    
    print_success "EAS CLI found"
    
    # Check if logged in
    if ! eas whoami >/dev/null 2>&1; then
        print_warning "Not logged in to EAS. Please run: eas login"
        exit 1
    fi
    
    print_success "EAS CLI authenticated"
}

# Function to check Expo CLI
check_expo_cli() {
    if ! command_exists expo; then
        print_error "Expo CLI not found. Please install it first:"
        echo "npm install -g @expo/cli"
        exit 1
    fi
    
    print_success "Expo CLI found"
}

# Function to validate environment
validate_environment() {
    print_status "Validating environment..."
    
    if [ -f "./scripts/validate-env.sh" ]; then
        if ./scripts/validate-env.sh; then
            print_success "Environment validation passed"
        else
            print_error "Environment validation failed"
            exit 1
        fi
    else
        print_warning "Environment validation script not found"
    fi
}

# Function to build development client
build_dev_client() {
    local platform=$1
    
    print_status "Building development client for $platform..."
    
    case $platform in
        android)
            eas build --profile development --platform android
            ;;
        ios)
            eas build --profile development --platform ios
            ;;
        all)
            eas build --profile development --platform all
            ;;
        *)
            print_error "Invalid platform: $platform"
            echo "Valid options: android, ios, all"
            exit 1
            ;;
    esac
    
    print_success "Development client build initiated for $platform"
    print_status "Check build status at: https://expo.dev"
}

# Function to start development server
start_dev_server() {
    local mode=$1
    
    print_status "Starting development server..."
    
    case $mode in
        normal)
            expo start --dev-client
            ;;
        tunnel)
            print_status "Starting with tunnel mode (for network issues)..."
            expo start --dev-client --tunnel
            ;;
        clear)
            print_status "Starting with cleared cache..."
            expo start --dev-client --clear
            ;;
        *)
            print_error "Invalid mode: $mode"
            echo "Valid options: normal, tunnel, clear"
            exit 1
            ;;
    esac
}

# Function to show help
show_help() {
    echo "PassFit Development Client Setup Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  check           Check prerequisites (EAS CLI, Expo CLI, environment)"
    echo "  build [platform] Build development client (android|ios|all)"
    echo "  start [mode]    Start development server (normal|tunnel|clear)"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 check                    # Check all prerequisites"
    echo "  $0 build android           # Build Android development client"
    echo "  $0 build ios               # Build iOS development client"
    echo "  $0 build all               # Build for both platforms"
    echo "  $0 start normal            # Start normal development server"
    echo "  $0 start tunnel            # Start with tunnel mode"
    echo "  $0 start clear             # Start with cleared cache"
    echo ""
    echo "Setup Process:"
    echo "  1. Run '$0 check' to verify prerequisites"
    echo "  2. Run '$0 build [platform]' to build development client"
    echo "  3. Install the built APK/IPA on your device"
    echo "  4. Run '$0 start normal' to start development server"
    echo "  5. Open PassFit Development Client (NOT Expo Go) and scan QR code"
}

# Main script logic
main() {
    case $1 in
        check)
            print_status "Checking prerequisites..."
            check_eas_cli
            check_expo_cli
            validate_environment
            print_success "All prerequisites met!"
            ;;
        build)
            check_eas_cli
            validate_environment
            build_dev_client $2
            ;;
        start)
            check_expo_cli
            start_dev_server ${2:-normal}
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            if [ -z "$1" ]; then
                show_help
            else
                print_error "Unknown command: $1"
                echo ""
                show_help
                exit 1
            fi
            ;;
    esac
}

# Run main function with all arguments
main "$@"
