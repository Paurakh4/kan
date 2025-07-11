# KAN Docker Deployment Guide

This guide provides step-by-step instructions for building and running the KAN (Kolmogorov-Arnold Networks) application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)
- At least 4GB of available RAM
- At least 10GB of available disk space

## Quick Start

### 1. Clean Start (Recommended)

If you want to start completely fresh:

```bash
# Clean up any existing Docker containers/images
./docker-clean.sh

# Build the Docker containers
./docker-build.sh

# Run the application
./docker-run.sh
```

### 2. Access the Application

Once the containers are running, access the application at:
**http://localhost:3003**

## Detailed Instructions

### Step 1: Environment Configuration

The application uses environment variables defined in `.env`. The key settings for Docker are:

```env
# Application URL (automatically set for Docker)
NEXT_PUBLIC_BASE_URL=http://localhost:3003

# Database credentials
POSTGRES_PASSWORD=yourpassword
POSTGRES_HOST_AUTH_METHOD=trust

# Authentication secret (generate a secure random string)
BETTER_AUTH_SECRET=hauahsjeoiytriondhsjsjsddshfshdsdhijdnf

# Docker-specific settings
NEXT_PUBLIC_USE_STANDALONE_OUTPUT=true
```

### Step 2: Build Docker Images

```bash
./docker-build.sh
```

This script will:
- Check for required files (.env)
- Verify Docker is running
- Clean up existing containers/images
- Build the web application and database containers
- Display build progress and completion status

**Build time:** Approximately 3-5 minutes on first build

### Step 3: Run the Application

```bash
./docker-run.sh
```

This script will:
- Start PostgreSQL database container
- Wait for database to be healthy
- Start the web application container
- Run database migrations automatically
- Display container status and access information

### Step 4: Verify Deployment

Check that both containers are running:

```bash
docker-compose ps
```

Expected output:
```
NAME      IMAGE         COMMAND                  SERVICE    CREATED          STATUS                    PORTS
kan-db    postgres:15   "docker-entrypoint.s…"   postgres   X minutes ago    Up X minutes (healthy)    0.0.0.0:5432->5432/tcp
kan-web   kan-web       "docker-entrypoint.s…"   web        X minutes ago    Up X minutes              0.0.0.0:3003->3000/tcp
```

## Container Architecture

### Web Container (`kan-web`)
- **Base Image:** Node.js 20 Alpine
- **Port:** 3003 (host) → 3000 (container)
- **Features:**
  - Next.js application with production build
  - Automatic database migration on startup
  - Health checks and database connectivity verification
  - Optimized for production deployment

### Database Container (`kan-db`)
- **Base Image:** PostgreSQL 15
- **Port:** 5432 (host) → 5432 (container)
- **Features:**
  - Persistent data storage via Docker volumes
  - Health checks for container readiness
  - Automatic database initialization

## Management Commands

### View Logs
```bash
# View all logs
docker-compose logs -f

# View web application logs only
docker-compose logs -f web

# View database logs only
docker-compose logs -f postgres
```

### Stop the Application
```bash
docker-compose down
```

### Restart the Application
```bash
docker-compose restart
```

### Complete Cleanup
```bash
./docker-clean.sh
```

## Troubleshooting

### Port Conflicts
If port 3003 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3004:3000"  # Change 3003 to any available port
```

### Database Connection Issues
1. Check if PostgreSQL container is healthy:
   ```bash
   docker-compose ps
   ```

2. View database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart the database container:
   ```bash
   docker-compose restart postgres
   ```

### Web Application Issues
1. Check web container logs:
   ```bash
   docker-compose logs web
   ```

2. Restart the web container:
   ```bash
   docker-compose restart web
   ```

### Build Issues
1. Clean Docker cache and rebuild:
   ```bash
   ./docker-clean.sh
   docker system prune -a
   ./docker-build.sh
   ```

## Development vs Production

This Docker setup is optimized for development and testing. For production deployment:

1. Use environment-specific `.env` files
2. Configure proper SSL/TLS certificates
3. Set up proper backup strategies for the database
4. Configure monitoring and logging
5. Use Docker Swarm or Kubernetes for orchestration

## File Structure

```
kan/
├── docker-compose.yml          # Container orchestration
├── apps/web/Dockerfile         # Web application container definition
├── docker-build.sh            # Build script
├── docker-run.sh              # Run script
├── docker-clean.sh            # Cleanup script
├── .env                       # Environment variables
└── DOCKER_DEPLOYMENT.md       # This documentation
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review container logs for error messages
3. Ensure all prerequisites are met
4. Try a complete cleanup and rebuild

For additional help, refer to the main project documentation or create an issue in the project repository.
