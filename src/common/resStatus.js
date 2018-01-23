export default function status(data, vueInstance, cb = function(){}){
    vueInstance.$alert(data.msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
            cb(action)
        }
    })

}