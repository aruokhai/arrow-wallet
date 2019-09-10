
async function f() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 1000)
    });
  
    throw new Error("money");
  }
  
  async function j(){
    throw new Error("money");

}
  async function m(){ 
      j().catch(err => {
          console.log(err.message);
      });
  }
  m()