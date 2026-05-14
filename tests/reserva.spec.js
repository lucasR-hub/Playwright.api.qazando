
import { test, expect } from '@playwright/test';
import { exec } from 'node:child_process';

var tokenRecebido


test('consultando Reserva', async ({ request }) => {
  // chamada na api
  const response = await request.get('/booking/');
  // verifica se a respota da APi foi bem sucedida
  expect(response.ok).toBeTruthy();
  // verifica se a reposta é igual a 200
  expect(response.status()).toBe(200);  
  // imprime a resposta da API no console
  console.log(await response.json());
  
});

test('consultando Reserva por ID', async ({ request }) => {

  const response = await request.get('/booking/665');
  const responseBody = await response.json();

  expect(responseBody.firstname).toBe ("Lukkiinha"),
	expect(responseBody.lastname).toBe("Brown"), 
	expect(responseBody.totalprice).toBe(111),
	expect(responseBody.depositpaid).toBe(true),
	expect(responseBody.bookingdates.checkin).toBe("2026-05-01"),
	expect(responseBody.bookingdates.checkout).toBe("2026-05-10"),
	expect(responseBody.additionalneeds).toBe("Coca-Cola");

  expect(response.status()).toBe(200)
  console.log(responseBody);


});

test('consultando Reserva por ID validando somente campos', async ({ request }) => {

  const response = await request.get('/booking/665');
  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('firstname');
  expect(responseBody).toHaveProperty('lastname');
  expect(responseBody).toHaveProperty('totalprice');
  expect(responseBody).toHaveProperty('depositpaid');
  expect(responseBody).toHaveProperty('bookingdates');
  expect(responseBody).toHaveProperty('additionalneeds');
 
  expect(response.status()).toBe(200)
  console.log(responseBody);

});

test('cadastro de reserva', async ({ request }) => {

  const response = await request.post('/booking/',{
    data:
     {"firstname": "Lukkiinha",
      "lastname": "Roro",
      "totalprice": 222,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2026-05-01",
        "checkout": "2026-05-10"
      },
      "additionalneeds": "Coca-Cola"
      
    }
});

   const responseBody = await response.json();

  expect(responseBody.booking).toHaveProperty('firstname', 'Lukkiinha');
  expect(responseBody.booking).toHaveProperty('lastname', 'Roro');
  expect(responseBody.booking).toHaveProperty('totalprice', 222);
  expect(responseBody.booking).toHaveProperty('depositpaid', true);
 // expect(responseBody.booking).toHaveProperty('bookingdates');
  //expect(responseBody.booking).toHaveProperty('additionalneeds');
 
  expect(response.status()).toBe(200)
  console.log(responseBody);
  

});

test('Gerar token', async ({ request }) => {

  const response = await request.post('/auth',{
    data:{
      "username": "admin",
      "password": "password123"
    }
});
    expect(response.status()).toBe(200)
    //console.log(await response.json());

    const authResponse = await response.json();
    tokenRecebido = authResponse.token;
    console.log('Token gerado:', token);
});



test('Atualizacao reserva', async ({ request }) => {

  const response = await request.post('/auth',{
    data:{
      "username": "admin",
      "password": "password123"
    }
});
    expect(response.status()).toBe(200)
    
    const authResponse = await response.json();
    tokenRecebido = authResponse.token;
    console.log('Token gerado:', tokenRecebido);

const updateResponse = await request.patch('/booking/558', {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': `token=${tokenRecebido}`
  },
  data: {
    "firstname": "Lukkiinhas",
    "lastname": "xxxx",
    "totalprice": 333,
    "depositpaid": false,
    }
  });

    expect(updateResponse.status()).toBe(200);
const updateResponseBody = await updateResponse.json();
expect(updateResponseBody).toHaveProperty('firstname', 'Lukkiinhas');
expect(updateResponseBody).toHaveProperty('lastname', 'xxxx');
expect(updateResponseBody).toHaveProperty('totalprice', 333);
expect(updateResponseBody).toHaveProperty('depositpaid', false);
console.log(updateResponseBody);
});


test('Atualizacao parcial', async ({ request }) => {

  // criando o token

  const response = await request.post('/auth', {

    data: {

      "username": "admin",

      "password": "password123"

  }

});

  console.log(await response.json());

  // Verificando se a resposta da API está OK

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  tokenRecebido = responseBody.token;

  console.log("Seu token é:" + tokenRecebido);

  // Atualizando dados da reserva:

  const partialUpdateRequest = await request.patch('/booking/198', {

    headers: {

        'Content-Type': 'application/json',

        'Accept': 'application/json',

        'Cookie': `token=${tokenRecebido}`

    },

    data: {

        "firstname": "herbert",

        "lastname": "herbertao",

        "totalprice": 111,

        "depositpaid": false

    }

});

console.log(await partialUpdateRequest.json());

expect(partialUpdateRequest.ok()).toBeTruthy();

expect(partialUpdateRequest.status()).toBe(200);

const partialUpdatedResponseBody = await partialUpdateRequest.json()

expect(partialUpdatedResponseBody).toHaveProperty("firstname", "herbert");

expect(partialUpdatedResponseBody).toHaveProperty("lastname", "herbertao");

expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 111);

expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);
});
