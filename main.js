const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1'
});
api.defaults.headers.common['X-API-KEY'] = 'live_QBSMUgyr2Pn7axbQld7rXSU4z9QPXU3a4LifJw1Uhwn6INt4riU3PQQJAbS9XWbh';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_QBSMUgyr2Pn7axbQld7rXSU4z9QPXU3a4LifJw1Uhwn6INt4riU3PQQJAbS9XWbh`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error')

async function loadRandonMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    console.log('Random')
    console.log(data)

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error" + res.status;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');
        
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavouriteMichis(data[0].id);
        btn2.onclick = () => saveFavouriteMichis(data[1].id);
        btn3.onclick = () => saveFavouriteMichis(data[2].id);
    }
}

async function loadFavouriteMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_QBSMUgyr2Pn7axbQld7rXSU4z9QPXU3a4LifJw1Uhwn6INt4riU3PQQJAbS9XWbh',
        },
    });
    const data = await res.json();
    console.log('Favoritos')
    console.log(data)
    
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un errpr: " + res.status + data.messange;
    } else {
        const section = document.getElementById('favoriteMichis')
        section.innerHTML = "";

        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);  

        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');
      
            img.src = michi.image.url;
            img.width = 150;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouriteMichi(michi.id);
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
          });
    }
}

async function saveFavouriteMichis(id) {
  const {data, status } = await api.post('/favourites', {
    image_id: id,
  });

    /*const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-API-KEY': 'live_QBSMUgyr2Pn7axbQld7rXSU4z9QPXU3a4LifJw1Uhwn6INt4riU3PQQJAbS9XWbh',
        },
        body: JSON.stringify({
           image_id: id
        }),
    });
    const data = await res.json();*/

    console.log('Seve')
    /*console.log(res)*/

    if (status !== 200) {
        spanError.innerHTML = "Hubo un errpr: " + status + data.messange;
    }else {
        console.log('Michi guardado en favoritos')
        loadFavouriteMichis();
      }
}

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
      method: 'DELETE',
      headers: {
        'x-API-KEY': 'live_QBSMUgyr2Pn7axbQld7rXSU4z9QPXU3a4LifJw1Uhwn6INt4riU3PQQJAbS9XWbh',
      }
    });
    const data = await res.json();
  
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
      console.log('Michi eliminado de favoritos')
      loadFavouriteMichis();
    }
}

async function uploadMichiPhoto() {
  const form = document.getElementById('uploadingForm')
  const formData = new FormData(form);
  
  console.log(formData.get('file'))

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      'X-API-KEY': 'live_QBSMUgyr2Pn7axbQld7rXSU4z9QPXU3a4LifJw1Uhwn6INt4riU3PQQJAbS9XWbh',
    },
    body: formData,
  }) 
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.log({data})
  } else {
    console.log('Foto de michi subida :)')
    console.log({data})
    console.log(data.url)
    saveFavouriteMichis(data.id);
  }
}  
  
loadRandonMichis();
loadFavouriteMichis();