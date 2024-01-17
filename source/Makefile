NAME=s3-test-app
REGISTRY ?= quay.io
REGISTRY_ORG ?= appvia
VERSION ?= latest

build:
	@echo "--> Building"
	npm install
	npm run build

docker-release:
	@echo "--> Building a release image"
	@$(MAKE) docker
	@docker push ${REGISTRY}/${REGISTRY_ORG}/${NAME}:${VERSION}

docker:
	@echo "--> Building the docker image"
	docker build -t ${REGISTRY}/${REGISTRY_ORG}/${NAME}:${VERSION} .

run-docker:
	@$(MAKE) docker
	docker run -p 3001:3001 "${REGISTRY}/${REGISTRY_ORG}/${NAME}:${VERSION}"
