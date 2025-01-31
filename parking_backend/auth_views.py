from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status


# 📌 Login: Retorna Access Token y Refresh Token
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]


# 📌 Refresh: Permite renovar el Access Token con el Refresh Token
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


# 📌 Logout: Invalida el Refresh Token
class LogoutView(APIView):
    # Solo usuarios autenticados pueden hacer logout
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # Obtener refresh token del request
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Invalida el token en la base de datos

            return Response({"message": "Logout exitoso."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
