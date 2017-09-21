# 2FABackend

Backend for verification of Time based OTP (one Time Password) generated on the mobile phone for enforcing 2FA access control to the VS Shop mobile app. Also implemented as a plugin for reuse across the 3 verticals.


<b>ENABLE A USER</b>


```
{
	"uid":"59c379a983a1f1f360cae822"
}
```


Endpoint: otpapi/enableOtp<br />
Method: POST




<b>DISABLE A USER</b>


```
{
	"uid":"59c379a983a1f1f360cae822"
}
```


Endpoint: otpapi/disableTotp<br />
Method: DELETE


<b>GET A USER TOTP</b>


```
{
	"uid":"59c379a983a1f1f360cae822"
}
```


Endpoint: otpapi/getTotp<br />
Method: POST


<b>VERIFY A USER TOTP</b>


```
{
	"uid":"59c34180dd7ef2ec11587a1f",
	"token":"154308"
}
```


Endpoint: otpapi/verifyOtp <br />
Method: POST

