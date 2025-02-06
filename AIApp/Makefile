CleanContainer:
	@echo "Cleaning Previous Image and Container"
	@docker stop AIInference
	@docker rm AIInference
	@docker rmi aiinferenceapi
	

SpinContainer:
	@echo "Building New Image and Spinning New Containter"
	@docker build -t aiinferenceapi -f Docker/InferenceAPI.Dockerfile .
	@docker run --name AIInference -d -it -p 8000:8000 aiinferenceapi 