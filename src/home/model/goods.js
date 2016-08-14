'use strict';
/**
 * model
 */
export default class extends think.model.relation {
  init(...args){
    super.init(...args);
    this.relation = {
    };
  }

  async getTopCover(){
    let ids = await this.model('goods')
                      .setRelation(false)
                      .order('g_sold desc')
                      .limit(5).field('id')
                      .select();
    let urls = [];
    for(let i = 0; i < ids.length; i++){
      urls[i] = await this.model('cover')
                      .where({'g_id': ids[i].id})
                      .field('url')
                      .limit(1)
                      .select();
    }
    return urls;
  }

  async getGoodsType(){
    let data = await this.model('goodstype')
                      .field('gt_name')
                      .select();
    return data;
  }
  /**
   * [getHotGoods description]
   * 返回对应条数num的最热商品信息                    
   */
  async getHotGoods(num){
    let data = [];
    let hotGoods = await this.model('goods')
                      .order('g_sold desc')
                      .limit(num)
                      .select();
    for(let i = 0; i < hotGoods.length; i++){
      data[i] = {};
      data[i].descript = hotGoods[i].g_descript;
      let tempPrize = await this.model('gooddetail')
                            .where({
                              'g_id': hotGoods[i].id
                            })
                            .field('del_prize')
                            .limit(1)
                            .select();
      data[i].prize = tempPrize[0].del_prize;
      let tempCover = await this.model('cover')
                            .where({
                              'g_id': hotGoods[i].id
                            })
                            .field('url')
                            .limit(1)
                            .select();
      data[i].cover = tempCover[0].url;                      
    }
    return data;

  }
  /**
   * 获取最新的num条消息
   * 
   */
  async getNewGoods(num){
    let data = [];
    let hotGoods = await this.model('goods')
                      .order('g_time desc')
                      .limit(num)
                      .select();
    for(let i = 0; i < hotGoods.length; i++){
      data[i] = {};
      data[i].descript = hotGoods[i].g_descript;
      let tempPrize = await this.model('gooddetail')
                            .where({
                              'g_id': hotGoods[i].id
                            })
                            .field('del_prize')
                            .limit(1)
                            .select();
      data[i].prize = tempPrize[0].del_prize;
      let tempCover = await this.model('cover')
                            .where({
                              'g_id': hotGoods[i].id
                            })
                            .field('url')
                            .limit(1)
                            .select();
      data[i].cover = tempCover[0].url;                      
    }
    return data;
  }
}