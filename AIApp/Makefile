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
	@ACTUAL_API_KEY="AlfredoAIAPIEndpoint" GOOGLE_API_KEY="AIzaSyD2PKaRVlTeXVNRVdyOvCw59KZj2Hv1Iw4" poetry run uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload

ConnectEC2:
	@ssh -i AlfredoAIAPI.pem admin@ec2-3-72-247-90.eu-central-1.compute.amazonaws.com

DevInference:
	@./DevLazyCurl.sh > aiappout.json

ProdInference:
	@./LazuCurl.sh > aiappout.json 

ReloadAPI:
	@docker restart APIInference

ProdCurl:
	@./LazyCurl.sh

DevCurl:
	@./DevLazyCurl.sh