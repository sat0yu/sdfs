import * as fs from "fs";
import "./@types/fuse-native";
import "fuse-native";

const ops = {
  readdir: (path, cb) => {
    if (path === "/") return cb(null, ["test"]);
    return cb(Fuse.ENOENT);
  },
  getattr: (path, cb) => {
    if (path === "/") return cb(null, stat({ mode: "dir", size: 4096 }));
    if (path === "/test") return cb(null, stat({ mode: "file", size: 11 }));
    return cb(Fuse.ENOENT);
  },
  open: (path, flags, cb) => {
    return cb(0, 42);
  },
  release: (path, fd, cb) => {
    return cb(0);
  },
  read: (path, fd, buf, len, pos, cb) => {
    var str = "hello world".slice(pos, pos + len);
    if (!str) return cb(0);
    buf.write(str);
    return cb(str.length);
  },
};

const fuse = new Fuse(mnt, ops, { debug: true });
fuse.mount((err) => {
  fs.readFile(path.join(mnt, "test"), function (err, buf) {
    // buf should be 'hello world'
  });
});
