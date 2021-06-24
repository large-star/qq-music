export default class Song {
  constructor({id,name,singer,album,image}) {
    this.id = id
    this.name = name
    this.singer = singer
    this.album = album
    this.image = image
  }
}

export function createSong(song) {
  return new Song({
    id: song.id,
    name: song.name,
    singer: filterSinger(song.ar || song.artists),
    album: song.al.name,
    image: song.al.picUrl
  })
}

export function filterSinger(singer) {
  let ret = []
  if(!singer) return ''
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join(' / ')
}