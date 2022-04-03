const FirstName = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(['Adam','Ali','Itay','Kobi']);
    }, 2000);
    setTimeout(()=>{
        reject('No data for you..');
    }, 3000);
})

const LastName = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(['Zianda','Chitrit','Azulay','Biton']);
    }, 2000);
    setTimeout(()=>{
        reject('No data for you..');
    }, 5000);
})

// Promise.all([FirstName,LastName])
// .then(data => console.log(data))
// .catch(err => console.log(err))
Promise.all(([FirstName,LastName]))
.then(([FirstName,LastName]) => {
    for(i=0;i<FirstName.length;i++) {
        console.log(FirstName[i] +" " + LastName[i])
    }
})
.catch(err => console.log(err))