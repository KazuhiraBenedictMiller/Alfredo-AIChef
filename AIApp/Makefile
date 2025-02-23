CleanContainer:
	@echo "Cleaning Previous Image and Container"
	@docker stop AIInference
	@docker rm AIInference
	@docker rmi aiinferenceapi
	
SpinContainer:
	@echo "Building New Image and Spinning New Containter"
	@docker build -t aiinferenceapi -f Docker/InferenceAPI.Dockerfile .
	@docker run --name AIInference -d -it -e ACTUAL_API_KEY="AlfredoAIAPIEndpoint" -p 8000:8000 aiinferenceapi 

SpinDevFastAPI:
	@ACTUAL_API_KEY="AlfredoAIAPIEndpoint" poetry run uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload

ReloadAPI:
	@docker restart APIInference

ProdCurl:
	@./LazyCurl.sh

DevCurl:
	@./DevLazyCurl.sh