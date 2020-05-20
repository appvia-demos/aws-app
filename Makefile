NAME=s3-test-app
AUTHOR ?= appvia
REGISTRY=quay.io
VERSION ?= latest

build:
	@echo "--> Building"
	npm install
	npm run build

docker-release:
	@echo "--> Building a release image"
	@$(MAKE) docker
	@docker push ${REGISTRY}/${AUTHOR}/${NAME}:${VERSION}

docker:
	@echo "--> Building the docker image"
	docker build -t ${REGISTRY}/${AUTHOR}/${NAME}:${VERSION} .

run-docker:
	@$(MAKE) docker
	docker run -p 3001:3001 "${REGISTRY}/${AUTHOR}/${NAME}:${VERSION}"
