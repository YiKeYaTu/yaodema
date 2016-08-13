'use strict';
/**
 * model
 */
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
      cover: {
        type: think.model.HAS_MANY, //relation type
        model: "", //model name
        name: "pic_url", //data name
        key: "id", 
        fKey: "g_id", //forign key
        field: "url",
        where: "",
        order: "",
        limit: "",
        rModel: "",
        rfKey: ""
      },
    };
  }

  async getTopCover(){
    let ids = await this.model('goods').setRelation(false).order('g_sold desc').limit(5).field('id').select();
    let urls;
    ids.map((item, index) => {
      urls[index] = this.model('cover').where('g_id', item.id).field('url').limit(1).select();
    });
    console.log(urls);
  }
}