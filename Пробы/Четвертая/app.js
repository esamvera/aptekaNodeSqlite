	
	const http = require("http");
	const fs = require("fs");
	const sqlite3 = require("sqlite3").verbose();
	
	let giveArray = [];
	let giveArray2 = {};

	const server = http.createServer(function(request, response){
		
		// обрабатываем специфичные пути (запросы)
		if(request.url === "/getArray"){

					if(giveArray.length == 0){
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
									response.end(JSON.stringify(giveArray));
								});
								//console.log(giveArray);
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
					}		
		}	
		
		
		
		//ещё обрабатываем специфичные пути (запросы)
		else if(request.url === "/giveMeInfo"){
			
			let drugId = "";
			request.on("data", chunk => {
				drugId += chunk;
				console.log(drugId, "chunk");
			});
			
			request.on("end", () => {
				//console.log(drugId, "chunk 222");		
				//db.get("SELECT * FROM drugs WHERE id=$iidd", {$iidd: drugId}, function(err, row) 	

				//console.log(drugId, "chunk 333");
			
				const db = new sqlite3.Database("./apteka.db", sqlite3.OPEN_READWRITE,(err) => {
					if (err) {
						console.log(err.message);
					} 
					else {
						console.log('Снова Database opened!');	
						
						db.get("SELECT * FROM drugs WHERE id=$iidd", {$iidd: drugId}, function(err, row)
							{
								console.log(row.Name);
								console.log(row.Description);
								console.log(row.Availability);
								console.log(row.Price);	
								giveArray2.Name = row.Name;
								giveArray2.Description = row.Description;
								giveArray2.Availability = row.Availability;
								giveArray2.Price = row.Price;
								
								console.log(giveArray2.Name);
								console.log(giveArray2.Description);
								console.log(giveArray2.Availability);
								console.log(giveArray2.Price);
								
								console.log(typeof giveArray2, " typeof giveArray2");
								
								console.log('giveArray2:');
								console.log(giveArray2);	
								response.end(JSON.stringify(giveArray2));
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
				
			// буфер для получаемых данных
			//Перебор асинхронного итератора request
			//const buffers = [];
			//for await(const chunk of request){
			//	buffers.push(chunk);
			//}
			//let drugId = Buffer.concat(buffers).toString();
			
			//console.log('drugId chunkL ' + drugId);	
			//console.log('Снова Database opened!');	
			//console.log(typeof drugId);	
			
			//let qqq = 2;
			
				//способ вставки в строку запроса переменной -
				//db.get("SELECT * FROM drugs WHERE id=$iidd", {$iidd: переменная}, function(err, row) {}  
				//источник https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4
				// и https://gist.github.com/codesprintpro/98bef0dd9789ac7e119bcaccfa0d72a4#file-placeholder-js
			
		
			
			//console.log('giveArray2:');
			//console.log(giveArray2);
			//response.end(JSON.stringify(giveArray2));
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