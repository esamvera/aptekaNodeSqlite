	
	const http = require("http");
	const fs = require("fs");
	const sqlite3 = require("sqlite3").verbose();
	
	let giveArray = [];
	let giveArray2 = {};

	const server = http.createServer(function(request, response){
		
		// обрабатываем специфичные пути (запросы)
		if(request.url === "/getArray"){

					if(giveArray.length == 0){
						const t0 = performance.now();
						const db = new sqlite3.Database("./apteka.db", sqlite3.OPEN_READWRITE,(err) => {
							if (err) {
							console.log(err.message);
							} 
							else {
								console.log('Database opened!');
						
								db.all("SELECT * FROM drugs", function(err, rows) {
									rows.forEach(function(row) {						
										let giveObject = {};
										giveObject.id = row.id;
										giveObject.name = row.Name;
										giveArray.push(giveObject);
										//response.end(JSON.stringify(giveArray));
									});
									console.log('giveArray.length' + giveArray.length);
									response.end(JSON.stringify(giveArray));
								});
								//console.log('giveArray.length' + giveArray.length);
								//response.end(JSON.stringify(giveArray));
								
								db.close((err) => {
									if (err) {
										return console.error(err.message);
									}
									console.log('Close the database connection.');
								});	
								
							}			
							//response.end(JSON.stringify(giveArray));
						});
						const t1 = performance.now();
						console.log(t1 - t0, 'milliseconds');
						//0.20119999999951688 milliseconds
						//0.22299999999995634 milliseconds
						//0.2000000000007276 milliseconds
						//0.29540000000088185 milliseconds

					}
					
					else{
						response.end(JSON.stringify(giveArray));
					}
					
		}	
		
		
		
		//ещё обрабатываем специфичные пути (запросы)
		else if(request.url === "/giveMeInfo"){
			const t2 = performance.now();	
			let drugId = "";
			request.on("data", chunk => {
				drugId += chunk;
				console.log(drugId, "chunk");
			});
			
			request.on("end", () => {
				//console.log(drugId, "chunk 222");		
				//console.log(drugId, "chunk 333");
			
				const db = new sqlite3.Database("./apteka.db", sqlite3.OPEN_READWRITE,(err) => {
					if (err) {
						console.log(err.message);
					} 
					else {
						console.log('Снова Database opened!');	
						
						db.get("SELECT * FROM drugs WHERE id=$iidd", {$iidd: drugId}, function(err, row)
							{
								if (err) {
									return console.error(err.message);
								}
								else{									
									giveArray2.Name = row.Name;
									giveArray2.Description = row.Description;
									giveArray2.Availability = row.Availability;
									giveArray2.Price = row.Price;									
									
									response.end(JSON.stringify(giveArray2));									
								}								
							});				
						
						
						db.close((err) => {
							if (err) {
								return console.error(err.message);
							}
							console.log('Снова Close the database connection.');
						});	
					}
				});	
			});
			const t3 = performance.now();
			console.log(t3 - t2, 'milliseconds -second measure');	
			//0.19719999999870197 milliseconds -second measure
			//0.21830000000045402 milliseconds -second measure
			//0.1890999999959604 milliseconds -second measure
			//0.14280000000144355 milliseconds -second measure
			
				
			// буфер для получаемых данных
			//Перебор асинхронного итератора request
			//const buffers = [];
			//for await(const chunk of request){
			//	buffers.push(chunk);
			//}
			//let drugId = Buffer.concat(buffers).toString();
			
			//console.log('drugId chunkL ' + drugId);	
			
				//способ вставки в строку запроса переменной -
				//db.get("SELECT * FROM drugs WHERE id=$iidd", {$iidd: переменная}, function(err, row) {}  
				//источник https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4
				// и https://gist.github.com/codesprintpro/98bef0dd9789ac7e119bcaccfa0d72a4#file-placeholder-js
			
			//response.end(JSON.stringify(giveArray2));
		}	
		
		
		else if(request.url === "/"){
			fs.readFile("index.html", function(error, data){
				if(error){
					response.statusCode = 404;
					response.end("Resourse not found!");
				}
				else{
					response.end(data);
				}
			});	
		}
		
		
		//общий механизм обработки запросов
		else{		
			// получаем путь после слеша
			const filePath = request.url.substring(1);
			
			fs.readFile(filePath, function(error, data){
				if(error){
					response.statusCode = 404;
					response.end("Resourse not found!");
				}
				else{
					response.end(data);
				}
			});				
		}	
	});


	server.listen(3000, "127.0.0.1", function(){
		console.log("Сервер начал прослушивание запросов на порту 3000");
	});